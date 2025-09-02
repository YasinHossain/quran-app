'use client';

import React from 'react';
import BookmarksLayout from '../components/shared/BookmarksLayout';
import { usePinnedPage } from './hooks/usePinnedPage';
import { PinnedHeader, PinnedVersesList } from './components';

export default function PinnedAyahPage() {
  const { pinnedVerses, handleSectionChange } = usePinnedPage();

  return (
    <BookmarksLayout activeSection="pinned" onSectionChange={handleSectionChange}>
      <PinnedHeader />
      <PinnedVersesList pinnedVerses={pinnedVerses} />
    </BookmarksLayout>
  );
}
