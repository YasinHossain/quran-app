'use client';

import React from 'react';

import { LastReadHeader, LastReadGrid } from './components';
import { useLastReadPage } from './hooks/useLastReadPage';
import { BookmarksLayout } from '../components/shared/BookmarksLayout';

export default function LastReadPage() {
  const { lastRead, chapters, handleSectionChange } = useLastReadPage();

  return (
    <BookmarksLayout activeSection="last-read" onSectionChange={handleSectionChange}>
      <LastReadHeader />
      <LastReadGrid lastRead={lastRead} chapters={chapters} />
    </BookmarksLayout>
  );
}
