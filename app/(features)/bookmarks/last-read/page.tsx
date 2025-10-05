'use client';

import React from 'react';

import { BookmarksLayout } from '@/app/(features)/bookmarks/components/shared/BookmarksLayout';

import { LastReadHeader, LastReadGrid } from './components';
import { useLastReadPage } from './hooks/useLastReadPage';

export default function LastReadPage(): React.JSX.Element {
  const { lastRead, chapters, handleSectionChange } = useLastReadPage();

  return (
    <BookmarksLayout activeSection="last-read" onSectionChange={handleSectionChange}>
      <LastReadHeader />
      <LastReadGrid lastRead={lastRead} chapters={chapters} />
    </BookmarksLayout>
  );
}
