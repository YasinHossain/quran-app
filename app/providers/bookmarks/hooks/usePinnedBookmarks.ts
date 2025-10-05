import { useCallback } from 'react';

import type useBookmarkOperations from './useBookmarkOperations';
import type { Bookmark } from '@/types';

export function usePinnedBookmarks(
  pinnedVerses: Bookmark[],
  bookmarkOps: ReturnType<typeof useBookmarkOperations>
): { togglePinned: (verseId: string) => void; isPinned: (verseId: string) => boolean } {
  const togglePinned = useCallback(
    (verseId: string) => {
      const isPinned = pinnedVerses.some((b) => b.verseId === verseId);
      if (isPinned) {
        bookmarkOps.removeBookmark(verseId, 'pinned');
      } else {
        bookmarkOps.addBookmark(verseId, 'pinned');
      }
    },
    [pinnedVerses, bookmarkOps]
  );

  const isPinned = useCallback(
    (verseId: string) => pinnedVerses.some((b) => b.verseId === verseId),
    [pinnedVerses]
  );

  return { togglePinned, isPinned } as const;
}
