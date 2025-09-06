'use client';

import React from 'react';

import type { Verse } from '@/types';

interface BreadcrumbNavigationProps {
  onNavigateToBookmarks: () => void;
  folderName: string;
  activeVerseId?: string;
  verses: Verse[];
}

export const BreadcrumbNavigation = ({
  onNavigateToBookmarks,
  folderName,
  activeVerseId,
  verses,
}: BreadcrumbNavigationProps): React.JSX.Element => (
  <nav className="flex items-center space-x-2 text-sm mb-6 hidden lg:flex" aria-label="Breadcrumb">
    <button
      onClick={onNavigateToBookmarks}
      className="text-accent hover:text-accent-hover transition-colors"
    >
      Bookmarks
    </button>
    <span className="text-muted">/</span>
    <span className="text-foreground font-medium">{folderName}</span>
    {activeVerseId && (
      <>
        <span className="text-muted">/</span>
        <span className="text-muted">
          {(() => {
            const verse = verses.find((v) => String(v.id) === activeVerseId);
            return verse ? verse.verse_key : 'Verse';
          })()}
        </span>
      </>
    )}
  </nav>
);
