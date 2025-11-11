import { useBookmarks } from '@/app/providers/BookmarkContext';

import {
  useBookmarkIdentifierState,
  useEnrichedBookmarkMemo,
  useOrderedChapters,
  useResolvedVerseData,
} from './useBookmarkVerseDerivedState';
import { useBookmarkIdentifierSync, useBookmarkVerseContentSync } from './useBookmarkVerseSync';
import { deriveBookmarkError, deriveBookmarkLoadingState } from './utils/bookmarkVerse';

import type { Bookmark, Verse } from '@/types';

interface UseBookmarkVerseReturn {
  bookmark: Bookmark;
  verse: Verse | undefined;
  isLoading: boolean;
  error: string | null;
  mutate: () => void;
}

export function useBookmarkVerse(bookmark: Bookmark): UseBookmarkVerseReturn {
  const { chapters, updateBookmark } = useBookmarks();

  const orderedChapters = useOrderedChapters(chapters);
  const { verseIdentifier, identifierSource, derivedVerseKey, normalizedBookmark } =
    useBookmarkIdentifierState(bookmark, orderedChapters);

  const { verse, resolvedVerse, isLoading, error, mutate } = useResolvedVerseData(
    verseIdentifier,
    normalizedBookmark,
    derivedVerseKey
  );

  const enrichedBookmark = useEnrichedBookmarkMemo({
    normalizedBookmark,
    resolvedVerse,
    chapters: orderedChapters,
    fallbackTranslation: bookmark.translation ?? null,
  });

  useBookmarkIdentifierSync({
    verseIdentifier,
    identifierSource,
    currentVerseId: bookmark.verseId,
    ...(bookmark.verseKey !== undefined ? { currentVerseKey: bookmark.verseKey } : {}),
    updateBookmark,
  });

  useBookmarkVerseContentSync({
    verse,
    normalizedBookmark,
    chapters: orderedChapters,
    updateBookmark,
  });

  return {
    bookmark: enrichedBookmark,
    verse: resolvedVerse,
    isLoading: deriveBookmarkLoadingState({ resolvedVerse, verseIdentifier, isLoading }),
    error: deriveBookmarkError({
      resolvedVerse,
      verseIdentifier,
      normalizedBookmark,
      baseError: error,
    }),
    mutate,
  };
}
