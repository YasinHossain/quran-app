'use client';

import React from 'react';

import { BookmarkFolderContent } from '@/app/(features)/bookmarks/components/BookmarkFolderContent';
import { SidebarHeader } from '@/app/shared/components/SidebarHeader';
import { ArrowLeftIcon } from '@/app/shared/icons';

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
  <div className="relative flex flex-1 min-h-0 flex-col">
    <SidebarHeader
      title="Folders"
      onBack={onBack}
      showBackButton
      {...(onClose ? { onClose, showCloseButton: true } : {})}
      // Mobile-only header; keep subtle elevation but no divider line
      titleClassName="text-mobile-lg font-semibold text-foreground"
      backButtonClassName="hover:bg-gray-200 dark:hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      className="sticky top-0 shadow-none relative z-10 bg-background xl:hidden"
      forceVisible
    />
    <div className="flex-1 overflow-y-auto p-4">

      <BookmarkFolderContent bookmarks={bookmarks} folder={folder} />
    </div>
  </div>
);
