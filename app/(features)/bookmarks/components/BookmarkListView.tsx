'use client';

import React from 'react';

import { useBookmarkListState } from '@/app/(features)/bookmarks/hooks/useBookmarkListState';
import { Folder, Bookmark } from '@/types';

import { VerseList } from './bookmark-list-view/VerseList';
import {
  BookmarkListContent,
  BookmarkListHeader,
  EmptyBookmarkState,
} from './shared/BookmarkListComponents';

interface BookmarkListViewProps {
  folder: Folder;
  onBack?: (() => void) | undefined;
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
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

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
    <div
      className={`max-w-4xl mx-auto transform transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'
      }`}
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
    </div>
  );
};
