'use client';

import React from 'react';

import {
  BookmarkListContent,
  SimpleEmptyState,
} from '@/app/(features)/bookmarks/components/shared/BookmarkListComponents';
import { Bookmark, Folder } from '@/types';

interface VerseListProps {
  bookmarks: Bookmark[];
  folder: Folder;
  listHeight: number;
  onRemoveBookmark: (verseId: string) => void;
}

export const VerseList = ({
  bookmarks,
  folder,
  listHeight,
  onRemoveBookmark,
}: VerseListProps): React.JSX.Element =>
  bookmarks.length > 0 ? (
    <BookmarkListContent
      bookmarks={bookmarks}
      folder={folder}
      listHeight={listHeight}
      itemSize={140}
      onRemoveBookmark={onRemoveBookmark}
    />
  ) : (
    <SimpleEmptyState />
  );
