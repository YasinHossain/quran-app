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
      // Unified sidebar header styling
      withShadow={false}
      edgeToEdge
      titleAlign="center"
      titleClassName="text-mobile-lg font-semibold text-foreground"
      backButtonClassName="hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      className="border-b border-border bg-background shadow-none mb-2"
      containerContentClassName="-mx-2 sm:-mx-3 py-0"
      contentClassName="h-16 min-h-12 px-3 sm:px-4 py-0 sm:py-0"
    />
    <BookmarkFolderContent bookmarks={bookmarks} folder={folder} />
  </div>
);


