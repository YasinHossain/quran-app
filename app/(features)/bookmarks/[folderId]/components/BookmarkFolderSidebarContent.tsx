'use client';

import React from 'react';

import { BookmarkFolderContent } from '@/app/(features)/bookmarks/components/BookmarkFolderContent';
import { SidebarHeader } from '@/app/shared/components/SidebarHeader';

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
      title="Folders"
      onBack={onBack}
      showBackButton
      {...(onClose ? { onClose, showCloseButton: true } : {})}
      // Edge-to-edge divider with slimmer header
      edgeToEdge
      className="px-0 sm:px-0 border-b border-border shadow-none bg-transparent mx-[-8px] sm:mx-[-12px] mb-2"
      contentClassName="px-4 sm:px-5 py-2 sm:py-2.5"
    />
    <BookmarkFolderContent bookmarks={bookmarks} folder={folder} />
  </div>
);
