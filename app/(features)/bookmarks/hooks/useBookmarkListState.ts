import { useEffect, useState } from 'react';

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

  useEffect(() => {
    const updateHeight = (): void => {
      setListHeight(window.innerHeight - 200);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    if (externalBookmarks) {
      setBookmarks(externalBookmarks);
    } else {
      setBookmarks(folder.bookmarks);
    }
  }, [externalBookmarks, folder.bookmarks]);

  const handleRemoveBookmark = (verseId: string): void => {
    setBookmarks((prev) => prev.filter((bookmark) => String(bookmark.verseId) !== String(verseId)));
  };

  return { bookmarks, listHeight, handleRemoveBookmark };
};
