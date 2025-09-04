'use client';

import React from 'react';
import { BookmarksLayout } from '../components/shared/BookmarksLayout';
import { useLastReadPage } from './hooks/useLastReadPage';
import { LastReadHeader, LastReadGrid } from './components';

export default function LastReadPage() {
  const { lastRead, chapters, handleSectionChange } = useLastReadPage();

  return (
    <BookmarksLayout activeSection="last-read" onSectionChange={handleSectionChange}>
      <LastReadHeader />
      <LastReadGrid lastRead={lastRead} chapters={chapters} />
    </BookmarksLayout>
  );
}
