import { useCallback, useEffect, useMemo, useState } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { getVerseById, getVerseByKey } from '@/lib/api';
import type { Verse, Folder, Bookmark } from '@/types';

// Simple cache for verses
const verseCache = new Map<string, Verse>();

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

  // Function to load verses with caching
  const getVerseWithCache = useCallback(
    async (verseId: string, translationId: number): Promise<Verse> => {
      const cacheKey = `${verseId}-${translationId}`;

      if (verseCache.has(cacheKey)) {
        return verseCache.get(cacheKey)!;
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

      verseCache.set(cacheKey, verse);
      return verse;
    },
    []
  );

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
        console.error('Failed to load verses:', error);
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

export default useBookmarkFolderData;
