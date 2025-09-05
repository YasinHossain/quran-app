import { useEffect, useMemo, useState } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { getVerseById, getVerseByKey } from '@/lib/api';
import type { Bookmark, Folder, Verse } from '@/types';
import { logger } from '@/src/infrastructure/monitoring/Logger';

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

export async function getVerseWithCache(
  verseId: string,
  translationId: number
): Promise<Verse> {
  const cacheKey = `${verseId}-${translationId}`;

  if (verseCache.has(cacheKey)) {
    const verse = verseCache.get(cacheKey)!;
    // Refresh key to maintain LRU order
    verseCache.delete(cacheKey);
    verseCache.set(cacheKey, verse);
    return verse;
  }

  // Check if verseId is a composite key (e.g., "2:255") or a simple number
  const isCompositeKey = /:/.test(verseId);
  const isSimpleNumber = /^[0-9]+$/.test(verseId);

  let verse;
  if (isCompositeKey) {
    // It's already a verse key like "2:255"
    verse = await getVerseByKey(verseId, translationId);
  } else if (isSimpleNumber) {
    // It's a simple number like "1", "2", "3" - assume it's "1:1", "1:2", "1:3"
    const verseKey = `1:${verseId}`;
    verse = await getVerseByKey(verseKey, translationId);
  } else {
    // Try as direct verse ID
    verse = await getVerseById(verseId, translationId);
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
  const { folders } = useBookmarks();
  const { settings } = useSettings();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loadingVerses, setLoadingVerses] = useState<Set<string>>(new Set());

  const folder = useMemo(() => folders.find((f) => f.id === folderId), [folders, folderId]);
  const bookmarks = useMemo(() => folder?.bookmarks || [], [folder]);

  // Load all verses immediately
  useEffect(() => {
    const loadAllVerses = async () => {
      const verseIds = bookmarks.map((b) => b.verseId);

      if (verseIds.length === 0) {
        setVerses([]);
        setLoadingVerses(new Set());
        return;
      }

      setLoadingVerses(new Set(verseIds));

      try {
        const loadedVerses = await Promise.all(
          verseIds.map((id) => getVerseWithCache(id, settings.translationId))
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
  }, [bookmarks, settings.translationId, getVerseWithCache]);

  return {
    folder,
    bookmarks,
    verses,
    loadingVerses,
  } as const;
}

