import { useCallback, useEffect, useState } from 'react';

import type { Bookmark, Folder } from '@/types';

interface UseBookmarkListStateReturn {
  bookmarks: Bookmark[];
  listHeight: number;
  handleRemoveBookmark: (verseId: string) => void;
}

export const useBookmarkListState = (
  folder: Folder,
  externalBookmarks?: Bookmark[]
): UseBookmarkListStateReturn => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(externalBookmarks || folder.bookmarks);
  const [listHeight, setListHeight] = useState(0);

  const updateHeight = useCallback((): void => {
    setListHeight(window.innerHeight - 200);
  }, []);

  useEffect(() => {
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [updateHeight]);

  useEffect(() => {
    if (externalBookmarks) {
      setBookmarks(externalBookmarks);
    } else {
      setBookmarks(folder.bookmarks);
    }
  }, [externalBookmarks, folder.bookmarks]);

  const handleRemoveBookmark = useCallback((verseId: string): void => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.verseId !== verseId));
  }, []);

  return { bookmarks, listHeight, handleRemoveBookmark };
};
