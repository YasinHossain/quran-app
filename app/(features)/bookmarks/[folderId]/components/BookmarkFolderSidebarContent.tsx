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
  <div className="flex flex-1 min-h-0 flex-col">
    <SidebarHeader
      title="Folders"
      onBack={onBack}
      showBackButton
      {...(onClose ? { onClose, showCloseButton: true } : {})}
      // Unified sidebar header styling
      titleClassName="text-mobile-lg font-semibold text-foreground"
      backButtonClassName="hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      className="shadow-sm border-b border-border relative z-10"
      forceVisible
    />
    <div className="flex-1 overflow-y-auto p-4">
      <BookmarkFolderContent bookmarks={bookmarks} folder={folder} />
    </div>
  </div>
);
