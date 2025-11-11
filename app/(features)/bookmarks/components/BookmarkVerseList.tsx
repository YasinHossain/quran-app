'use client';

import React from 'react';

import { useBookmarkVerse } from '@/app/(features)/bookmarks/hooks/useBookmarkVerse';
import { ReaderVerseCard } from '@/app/shared/reader';
import { Spinner } from '@/app/shared/Spinner';

import {
  AnimatedMount,
  EmptyBookmarks,
  useBookmarkVerseActions,
  useMountVisible,
} from './BookmarkVerseList.parts';
import { useWorkspaceScrollRef, VirtualizedBookmarkList } from './BookmarkVerseList.virtual';

import type { Bookmark, Verse } from '@/types';

interface BookmarkVerseListProps {
  bookmarks: Bookmark[];
}

export const BookmarkVerseList = ({ bookmarks }: BookmarkVerseListProps): React.JSX.Element => {
  const hasBookmarks = bookmarks.length > 0;
  const { scrollElement, setRootRef } = useWorkspaceScrollRef();

  if (!hasBookmarks) return <EmptyBookmarks />;

  return (
    <VirtualizedBookmarkList
      bookmarks={bookmarks}
      scrollElement={scrollElement}
      setRootRef={setRootRef}
      renderItem={(bm) => <BookmarkVerseListItem bookmark={bm} />}
    />
  );
};

const BookmarkVerseListItem = ({ bookmark }: { bookmark: Bookmark }): React.JSX.Element => {
  const { bookmark: enrichedBookmark, verse, isLoading, error } = useBookmarkVerse(bookmark);

  if (error) {
    return (
      <div className="text-center py-6 text-status-error bg-status-error/10 p-4 rounded-lg">
        Failed to load verse {bookmark.verseId}. {error}
      </div>
    );
  }

  if (isLoading || !verse || !enrichedBookmark.verseKey) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-6 w-6 text-accent" />
      </div>
    );
  }

  return <LoadedBookmarkVerseItem verse={verse} bookmark={enrichedBookmark} />;
};

const LoadedBookmarkVerseItem = ({
  verse,
  bookmark,
}: {
  verse: Verse;
  bookmark: Bookmark;
}): React.JSX.Element => {
  const { verseRef, actions } = useBookmarkVerseActions(verse, bookmark);
  const isVisible = useMountVisible();

  return (
    <AnimatedMount isVisible={isVisible}>
      <ReaderVerseCard ref={verseRef} verse={verse} actions={actions} />
    </AnimatedMount>
  );
};
