'use client';

import React from 'react';
import { Bookmark, Folder } from '@/types';
import { BaseSidebar } from '@/app/shared/components/BaseSidebar';
import { SidebarHeader } from '@/app/shared/components/SidebarHeader';
import { BookmarkFolderContent } from './BookmarkFolderContent';

interface BookmarkFolderSidebarProps {
  bookmarks: Bookmark[];
  folder: Folder;
  activeVerseId?: string;
  onVerseSelect?: (verseId: string) => void;
  onBack?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const BookmarkFolderSidebar: React.FC<BookmarkFolderSidebarProps> = ({
  bookmarks,
  folder,
  activeVerseId,
  onVerseSelect,
  onBack,
  isOpen,
  onClose,
}) => {
  return (
    <BaseSidebar
      isOpen={isOpen}
      onClose={onClose}
      position="left"
      aria-label="Bookmark folder navigation"
    >
      <SidebarHeader title="Folder" {...(onBack && { onBack })} showBackButton={!!onBack} />
      <BookmarkFolderContent bookmarks={bookmarks} folder={folder} />
    </BaseSidebar>
  );
};
