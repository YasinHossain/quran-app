'use client';

import React from 'react';

import {
  PinnedEmptyState,
  PinnedLoading,
  VirtualizedPinnedList,
  useWorkspaceScrollRef,
} from './PinnedVersesListParts';

import type { Bookmark } from '@/types';

interface PinnedVersesListProps {
  bookmarks: Bookmark[];
  isLoading: boolean;
}

export const PinnedVersesList = ({
  bookmarks,
  isLoading,
}: PinnedVersesListProps): React.JSX.Element => {
  const { scrollElement, setRootRef } = useWorkspaceScrollRef();
  if (isLoading) return <PinnedLoading />;
  if (bookmarks.length === 0) return <PinnedEmptyState />;
  return (
    <VirtualizedPinnedList
      bookmarks={bookmarks}
      scrollElement={scrollElement}
      setRootRef={setRootRef}
    />
  );
};
