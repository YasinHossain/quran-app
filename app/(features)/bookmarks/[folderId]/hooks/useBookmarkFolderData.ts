import { useEffect, useMemo, useState } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { getVerseById, getVerseByKey } from '@/lib/api';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import type { Bookmark, Folder, Verse, Chapter } from '@/types';

// Simple cache for verses
const verseCache = new Map<string, Verse>();
export const VERSE_CACHE_LIMIT = 100;

/**
 * Clear all cached verses. Useful for tests and stale data scenarios.
 */
export function clearCache(): void {
  verseCache.clear();
}

// Expose cache for testing purposes
export const __verseCache = verseCache;

const inferVerseKeyFromId = (rawId: string, chapters: Chapter[]): string | null => {
  const numericId = Number.parseInt(rawId, 10);
  if (!Number.isFinite(numericId) || numericId <= 0) return null;

  let remaining = numericId;
  const orderedChapters = [...chapters].sort((a, b) => a.id - b.id);

  for (const chapter of orderedChapters) {
    if (remaining <= chapter.verses_count) {
      return `${chapter.id}:${remaining}`;
    }
    remaining -= chapter.verses_count;
  }

  return null;
};

export async function getVerseWithCache(
  verseId: string,
  translationId: number,
  chapters: Chapter[]
): Promise<Verse> {
  const cacheKey = `${verseId}-${translationId}`;

  if (verseCache.has(cacheKey)) {
    const verse = verseCache.get(cacheKey)!;
    // Refresh key to maintain LRU order
    verseCache.delete(cacheKey);
    verseCache.set(cacheKey, verse);
    return verse;
  }

  const isCompositeKey = /:/.test(verseId);
  let verse: Verse;

  if (isCompositeKey) {
    verse = await getVerseByKey(verseId, translationId);
  } else {
    const inferredKey = inferVerseKeyFromId(verseId, chapters);
    if (inferredKey) {
      try {
        verse = await getVerseByKey(inferredKey, translationId);
      } catch {
        verse = await getVerseById(verseId, translationId);
      }
    } else {
      verse = await getVerseById(verseId, translationId);
    }
  }

  // Enforce cache size limit (LRU)
  if (verseCache.size >= VERSE_CACHE_LIMIT) {
    const oldestKey = verseCache.keys().next().value as string;
    verseCache.delete(oldestKey);
  }
  verseCache.set(cacheKey, verse);
  return verse;
}

interface UseBookmarkFolderDataParams {
  folderId: string;
}

/**
 * Hook for managing bookmark folder data loading and caching.
 * Handles verse fetching with intelligent caching and loading states.
 */
export function useBookmarkFolderData({ folderId }: UseBookmarkFolderDataParams): {
  folder: Folder | undefined;
  bookmarks: Bookmark[];
  verses: Verse[];
  loadingVerses: Set<string>;
} {
  const { folders, chapters } = useBookmarks();
  const { settings } = useSettings();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loadingVerses, setLoadingVerses] = useState<Set<string>>(new Set());

  const folder = useMemo(() => folders.find((f) => f.id === folderId), [folders, folderId]);
  const bookmarks = useMemo(() => folder?.bookmarks || [], [folder]);

  // Load all verses immediately
  useEffect(() => {
    const loadAllVerses = async (): Promise<void> => {
      const verseIds = bookmarks.map((b) => b.verseId);

      if (verseIds.length === 0) {
        setVerses([]);
        setLoadingVerses(new Set());
        return;
      }

      setLoadingVerses(new Set(verseIds));

      if (!chapters.length) {
        return;
      }

      try {
        const loadedVerses = await Promise.all(
          verseIds.map((id) => getVerseWithCache(id, settings.translationId, chapters))
        );
        setVerses(loadedVerses);
      } catch (error) {
        setVerses([]);
        logger.error('Failed to load verses:', undefined, error as Error);
      } finally {
        setLoadingVerses(new Set());
      }
    };

    loadAllVerses();
  }, [bookmarks, settings.translationId, chapters]);

  return {
    folder,
    bookmarks,
    verses,
    loadingVerses,
  } as const;
}
