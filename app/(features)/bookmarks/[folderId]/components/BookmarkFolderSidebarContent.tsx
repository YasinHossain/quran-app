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
  <div className="relative flex flex-1 min-h-0 flex-col bg-background text-foreground">
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

    {/* Desktop Header: Hidden on mobile, Flex on xl+ */}
    <div className="hidden xl:flex items-center justify-between px-4 pb-4 pt-2 shrink-0">
      <button
        type="button"
        onClick={onBack}
        className="p-1 -ml-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label="Back"
      >
        <ArrowLeftIcon />
      </button>
      <span className="font-semibold text-lg text-foreground">Folders</span>
      {/* Spacer to keep title centered */}
      <div className="min-w-[40px]" />
    </div>

    <div
      className="flex-1 overflow-y-auto touch-pan-y"
      style={{ scrollbarGutter: 'stable' }}
    >
      {/* Top fade gradient */}
      <div className="sticky top-0 z-10 w-full h-5 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      <div className="px-2 sm:px-3 pb-4">
        <BookmarkFolderContent bookmarks={bookmarks} folder={folder} />
      </div>
    </div>
  </div>
);
