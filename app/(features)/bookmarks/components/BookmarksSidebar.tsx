'use client';

import React from 'react';
import { BaseSidebar } from '@/app/shared/components/BaseSidebar';
import { BookmarksContent } from './BookmarksContent';
import type { Folder } from '@/types/bookmark';

interface BookmarksSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  children?: React.ReactNode;
  folders?: Folder[];
  onVerseClick?: (verseKey: string) => void;
  isOpen: boolean;
  onClose: () => void;
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
  return (
    <BaseSidebar
      isOpen={isOpen}
      onClose={onClose}
      position="left"
      aria-label="Bookmarks navigation"
    >
      <BookmarksContent
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        folders={folders}
        onVerseClick={onVerseClick}
      >
        {children}
      </BookmarksContent>
    </BaseSidebar>
  );
};
