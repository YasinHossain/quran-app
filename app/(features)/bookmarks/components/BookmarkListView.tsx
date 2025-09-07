'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { Folder, Bookmark } from '@/types';

import { VerseList } from './bookmark-list-view/VerseList';
import {
  BookmarkListContent,
  BookmarkListHeader,
  EmptyBookmarkState,
} from './shared/BookmarkListComponents';
import { useBookmarkListState } from '../hooks/useBookmarkListState';

interface BookmarkListViewProps {
  folder: Folder;
  onBack?: () => void;
  bookmarks?: Bookmark[];
  showAsVerseList?: boolean;
}

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
    return (
      <VerseList
        bookmarks={bookmarks}
        folder={folder}
        listHeight={listHeight}
        onRemoveBookmark={handleRemoveBookmark}
      />
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
