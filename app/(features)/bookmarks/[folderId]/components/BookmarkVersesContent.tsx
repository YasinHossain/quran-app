'use client';

import React from 'react';

import { BookmarkVerseList } from '@/app/(features)/bookmarks/components/BookmarkVerseList';

import { BreadcrumbNavigation } from './BreadcrumbNavigation';

import type { Verse } from '@/types';

interface BookmarkVersesContentProps {
  onNavigateToBookmarks: () => void;
  folderName: string;
  activeVerseId?: string | undefined;
  verses: Verse[];
  displayVerses: Verse[];
  loadingVerses: Set<string>;
}

export const BookmarkVersesContent = ({
  onNavigateToBookmarks,
  folderName,
  activeVerseId,
  verses,
  displayVerses,
  loadingVerses,
}: BookmarkVersesContentProps): React.JSX.Element => (
  <div>
    <BreadcrumbNavigation
      onNavigateToBookmarks={onNavigateToBookmarks}
      folderName={folderName}
      activeVerseId={activeVerseId}
      verses={verses}
    />
    <BookmarkVerseList
      verses={displayVerses}
      isLoading={loadingVerses.size > 0 && verses.length === 0}
      error={null}
    />
  </div>
);
