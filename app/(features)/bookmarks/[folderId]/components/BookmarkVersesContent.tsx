'use client';

import React from 'react';

import { BookmarkVerseList } from '@/app/(features)/bookmarks/components/BookmarkVerseList';
import { usePrefetchSingleVerse } from '@/app/shared/hooks/useSingleVerse';

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
}: BookmarkVersesContentProps): React.JSX.Element => {
  const prefetchSingleVerse = usePrefetchSingleVerse();

  const verseTargets = React.useMemo(() => {
    if (!bookmarks.length) return [];
    return bookmarks
      .map((bookmark) => bookmark.verseKey ?? (bookmark.verseId ? String(bookmark.verseId) : null))
      .filter((value): value is string => Boolean(value));
  }, [bookmarks]);

  React.useEffect(() => {
    if (verseTargets.length === 0) return;
    void prefetchSingleVerse(verseTargets);
  }, [prefetchSingleVerse, verseTargets]);

  return (
    <div>
      <BreadcrumbNavigation onNavigateToBookmarks={onNavigateToBookmarks} folderName={folderName} />
      <BookmarkVerseList bookmarks={bookmarks} />
    </div>
  );
};
