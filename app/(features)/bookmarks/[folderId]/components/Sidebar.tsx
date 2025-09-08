'use client';

import React from 'react';

import { BookmarkFolderSidebar } from '@/app/(features)/bookmarks/components/BookmarkFolderSidebar';

import type { Bookmark, Folder } from '@/types';

interface SidebarProps {
  bookmarks: Bookmark[];
  folder: Folder;
  activeVerseId?: string;
  onVerseSelect: (verseId: string) => void;
  onBack: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({
  bookmarks,
  folder,
  activeVerseId,
  onVerseSelect,
  onBack,
  isOpen,
  onClose,
}: SidebarProps): React.JSX.Element => (
  <BookmarkFolderSidebar
    bookmarks={bookmarks}
    folder={folder}
    {...(activeVerseId && { activeVerseId })}
    onVerseSelect={onVerseSelect}
    onBack={onBack}
    isOpen={isOpen}
    onClose={onClose}
  />
);
