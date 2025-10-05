'use client';

import React from 'react';

import { BookmarksLayout } from '@/app/(features)/bookmarks/components/shared/BookmarksLayout';

import { PinnedHeader, PinnedVersesList } from './components';
import { usePinnedPage } from './hooks/usePinnedPage';

export default function PinnedAyahPage(): React.JSX.Element {
  const { pinnedVerses, handleSectionChange } = usePinnedPage();

  return (
    <BookmarksLayout activeSection="pinned" onSectionChange={handleSectionChange}>
      <PinnedHeader />
      <PinnedVersesList pinnedVerses={pinnedVerses} />
    </BookmarksLayout>
  );
}
