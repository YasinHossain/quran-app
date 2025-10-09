import { useCallback } from 'react';

import type useBookmarkOperations from './useBookmarkOperations';
import type { Bookmark } from '@/types';

const sameVerseId = (a: string | number, b: string | number): boolean => String(a) === String(b);

export function usePinnedBookmarks(
  pinnedVerses: Bookmark[],
  bookmarkOps: ReturnType<typeof useBookmarkOperations>
): {
  togglePinned: (verseId: string, metadata?: Partial<Bookmark>) => void;
  isPinned: (verseId: string) => boolean;
} {
  const togglePinned = useCallback(
    (verseId: string, metadata?: Partial<Bookmark>) => {
      const isPinned = pinnedVerses.some((b) => sameVerseId(b.verseId, verseId));
      if (isPinned) {
        bookmarkOps.removeBookmark(verseId, 'pinned');
      } else {
        bookmarkOps.addBookmark(verseId, 'pinned', metadata);
      }
    },
    [pinnedVerses, bookmarkOps]
  );

  const isPinned = useCallback(
    (verseId: string) => pinnedVerses.some((b) => sameVerseId(b.verseId, verseId)),
    [pinnedVerses]
  );

  return { togglePinned, isPinned } as const;
}
