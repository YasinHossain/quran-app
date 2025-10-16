import { useEffect, useMemo, useState } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import { getVerseWithCache } from '../../hooks/verseCache';

import type { Bookmark, Folder, Verse } from '@/types';

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
          verseIds.map((id) => getVerseWithCache(id, settings.translationIds, chapters, settings.wordLang))
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
  }, [bookmarks, settings.translationIds, settings.wordLang, chapters]);

  return {
    folder,
    bookmarks,
    verses,
    loadingVerses,
  } as const;
}
