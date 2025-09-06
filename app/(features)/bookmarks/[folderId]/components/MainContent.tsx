'use client';

import React from 'react';

import { BreadcrumbNavigation } from './BreadcrumbNavigation';
import { BookmarkVerseList } from '../../components/BookmarkVerseList';

import type { Verse } from '@/types';

interface MainContentProps {
  isHidden: boolean;
  folderName: string;
  activeVerseId?: string;
  verses: Verse[];
  displayVerses: Verse[];
  loadingVerses: Set<string>;
  onNavigateToBookmarks: () => void;
}

export const MainContent = ({
  isHidden,
  folderName,
  activeVerseId,
  verses,
  displayVerses,
  loadingVerses,
  onNavigateToBookmarks,
}: MainContentProps): React.JSX.Element => (
  <main className="h-screen text-foreground font-sans lg:ml-[20.7rem] overflow-hidden relative">
    <div
      className={`h-full overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6 transition-all duration-300 ${
        isHidden ? 'pt-12 lg:pt-4' : 'pt-24 lg:pt-20'
      }`}
    >
      <div>
        <BreadcrumbNavigation
          onNavigateToBookmarks={onNavigateToBookmarks}
          folderName={folderName}
          activeVerseId={activeVerseId}
          verses={verses}
        />
        <BookmarkVerseList
          verses={displayVerses}
          isLoading={loadingVerses.size > 0 && verses.length === 0}
          error={null}
        />
      </div>
    </div>
  </main>
);
