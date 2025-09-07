'use client';

import React from 'react';

import { BookmarkVersesContent } from './BookmarkVersesContent';

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
      <BookmarkVersesContent
        onNavigateToBookmarks={onNavigateToBookmarks}
        folderName={folderName}
        activeVerseId={activeVerseId}
        verses={verses}
        displayVerses={displayVerses}
        loadingVerses={loadingVerses}
      />
    </div>
  </main>
);
