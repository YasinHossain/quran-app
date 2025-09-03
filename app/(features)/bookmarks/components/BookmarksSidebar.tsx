'use client';

import React from 'react';
import { BaseSidebar } from '@/app/shared/components/BaseSidebar';
import { BookmarksContent } from './BookmarksContent';
import type { Folder } from '@/types/bookmark';
import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';

interface BookmarksSidebarProps {
  activeSection?: SectionId;
  onSectionChange?: (section: SectionId) => void;
  children?: React.ReactNode;
  folders?: Folder[];
  onVerseClick?: (verseKey: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const BookmarksSidebar: React.FC<BookmarksSidebarProps> = ({
  activeSection = 'bookmarks',
  onSectionChange,
  children,
  folders = [],
  onVerseClick,
  isOpen,
  onClose,
}) => {
  // If no isOpen/onClose provided, render content directly (for desktop sidebar)
  if (isOpen === undefined || onClose === undefined) {
    return (
      <BookmarksContent
        activeSection={activeSection}
        {...(onSectionChange && { onSectionChange })}
        folders={folders}
        {...(onVerseClick && { onVerseClick })}
      >
        {children}
      </BookmarksContent>
    );
  }

  // Otherwise use BaseSidebar wrapper (for mobile overlay)
  return (
    <BaseSidebar
      isOpen={isOpen}
      onClose={onClose}
      position="left"
      aria-label="Bookmarks navigation"
    >
      <BookmarksContent
        activeSection={activeSection}
        {...(onSectionChange && { onSectionChange })}
        folders={folders}
        {...(onVerseClick && { onVerseClick })}
      >
        {children}
      </BookmarksContent>
    </BaseSidebar>
  );
};
