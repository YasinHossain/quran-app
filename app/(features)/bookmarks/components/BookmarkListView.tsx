'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

import { Folder, Bookmark } from '@/types';

import {
  BookmarkListContent,
  BookmarkListHeader,
  EmptyBookmarkState,
  SimpleEmptyState,
} from './shared/BookmarkListComponents';

interface BookmarkListViewProps {
  folder: Folder;
  onBack?: () => void;
  bookmarks?: Bookmark[];
  showAsVerseList?: boolean;
}

const useBookmarkListState = (
  folder: Folder,
  externalBookmarks?: Bookmark[]
): {
  bookmarks: Bookmark[];
  listHeight: number;
  handleRemoveBookmark: (verseId: string) => void;
} => {
  const [bookmarks, setBookmarks] = useState(externalBookmarks || folder.bookmarks);
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
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.verseId !== verseId));
  };

  return { bookmarks, listHeight, handleRemoveBookmark };
};

export const BookmarkListView = ({
  folder,
  onBack,
  bookmarks: externalBookmarks,
  showAsVerseList = false,
}: BookmarkListViewProps): React.JSX.Element => {
  const { bookmarks, listHeight, handleRemoveBookmark } = useBookmarkListState(
    folder,
    externalBookmarks
  );

  if (showAsVerseList) {
    return bookmarks.length > 0 ? (
      <BookmarkListContent
        bookmarks={bookmarks}
        folder={folder}
        listHeight={listHeight}
        itemSize={140}
        onRemoveBookmark={handleRemoveBookmark}
      />
    ) : (
      <SimpleEmptyState />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <BookmarkListHeader folder={folder} bookmarkCount={bookmarks.length} onBack={onBack} />
      {bookmarks.length > 0 ? (
        <BookmarkListContent
          bookmarks={bookmarks}
          folder={folder}
          listHeight={listHeight}
          itemSize={180}
          onRemoveBookmark={handleRemoveBookmark}
        />
      ) : (
        <EmptyBookmarkState onBack={onBack} />
      )}
    </motion.div>
  );
};
