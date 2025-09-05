'use client';

import React from 'react';

import { PinnedHeader, PinnedVersesList } from './components';
import { usePinnedPage } from './hooks/usePinnedPage';
import { BookmarksLayout } from '../components/shared/BookmarksLayout';

export default function PinnedAyahPage() {
  const { pinnedVerses, handleSectionChange } = usePinnedPage();

  return (
    <BookmarksLayout activeSection="pinned" onSectionChange={handleSectionChange}>
      <PinnedHeader />
      <PinnedVersesList pinnedVerses={pinnedVerses} />
    </BookmarksLayout>
  );
}
