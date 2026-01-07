'use client';

import React from 'react';

import { useBookmarkVerse } from '@/app/(features)/bookmarks/hooks/useBookmarkVerse';
import { VerseSkeleton } from '@/app/shared/components/VerseSkeleton';
import { ReaderVerseCard } from '@/app/shared/reader';

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
      renderItem={(bm, index) => <BookmarkVerseListItem bookmark={bm} index={index} />}
    />
  );
};

const BookmarkVerseListItem = ({
  bookmark,
  index,
}: {
  bookmark: Bookmark;
  index: number;
}): React.JSX.Element => {
  const { bookmark: enrichedBookmark, verse, isLoading, error } = useBookmarkVerse(bookmark);

  if (error) {
    return (
      <div className="text-center py-6 text-status-error bg-status-error/10 p-4 rounded-lg">
        Failed to load verse {bookmark.verseId}. {error}
      </div>
    );
  }

  if (isLoading || !verse || !enrichedBookmark.verseKey) {
    return <VerseSkeleton index={index} />;
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
