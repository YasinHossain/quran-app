'use client';

import React from 'react';

import { BookmarkVerseList } from '@/app/(features)/bookmarks/components/BookmarkVerseList';

import { BreadcrumbNavigation } from './BreadcrumbNavigation';

import type { Verse } from '@/types';

interface BookmarkVersesContentProps {
  onNavigateToBookmarks: () => void;
  folderName: string;
  verses: Verse[];
  loadingVerses: Set<string>;
}

export const BookmarkVersesContent = ({
  onNavigateToBookmarks,
  folderName,
  verses,
  loadingVerses,
}: BookmarkVersesContentProps): React.JSX.Element => (
  <div>
    <BreadcrumbNavigation onNavigateToBookmarks={onNavigateToBookmarks} folderName={folderName} />
    <BookmarkVerseList
      verses={verses}
      isLoading={loadingVerses.size > 0 && verses.length === 0}
      error={null}
    />
  </div>
);
