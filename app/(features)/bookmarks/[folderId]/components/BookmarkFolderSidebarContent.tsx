'use client';

import React from 'react';

import { SidebarHeader } from '@/app/shared/components/SidebarHeader';

import { BookmarkFolderContent } from '@/app/(features)/bookmarks/components/BookmarkFolderContent';

import type { Bookmark, Folder } from '@/types';

interface BookmarkFolderSidebarContentProps {
  bookmarks: Bookmark[];
  folder: Folder;
  onBack: () => void;
  onClose?: () => void;
}

export const BookmarkFolderSidebarContent = ({
  bookmarks,
  folder,
  onBack,
  onClose,
}: BookmarkFolderSidebarContentProps): React.JSX.Element => (
  <div className="flex h-full flex-col">
    <SidebarHeader
      title="Folder"
      onBack={onBack}
      showBackButton
      {...(onClose ? { onClose, showCloseButton: true } : {})}
      className="px-4 py-3 sm:px-5 sm:py-4 border-b border-border bg-surface shadow-sm"
    />
    <BookmarkFolderContent bookmarks={bookmarks} folder={folder} />
  </div>
);
