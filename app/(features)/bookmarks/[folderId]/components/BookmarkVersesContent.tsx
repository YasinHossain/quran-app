'use client';

import React from 'react';

import { BookmarkVerseList } from '@/app/(features)/bookmarks/components/BookmarkVerseList';

import { BreadcrumbNavigation } from './BreadcrumbNavigation';

import type { Bookmark } from '@/types';

interface BookmarkVersesContentProps {
  onNavigateToBookmarks: () => void;
  folderName: string;
  bookmarks: Bookmark[];
}

export const BookmarkVersesContent = ({
  onNavigateToBookmarks,
  folderName,
  bookmarks,
}: BookmarkVersesContentProps): React.JSX.Element => (
  <div>
    <BreadcrumbNavigation onNavigateToBookmarks={onNavigateToBookmarks} folderName={folderName} />
    <BookmarkVerseList bookmarks={bookmarks} />
  </div>
);
