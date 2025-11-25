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
    <div className="pointer-events-none absolute inset-x-0 top-0 h-5 bg-[linear-gradient(to_bottom,rgb(var(--color-foreground)/0.08),rgb(var(--color-foreground)/0))] opacity-70" />
    <SidebarHeader
      title="Folders"
      onBack={onBack}
      showBackButton
      {...(onClose ? { onClose, showCloseButton: true } : {})}
      // Mobile-only header; keep subtle elevation but no divider line
      titleClassName="text-mobile-lg font-semibold text-foreground"
      backButtonClassName="hover:bg-gray-200 dark:hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      className="sticky top-0 shadow-none relative z-10 bg-background"
    />
    <div className="flex-1 overflow-y-auto p-4">
      <div className="hidden md:flex items-center justify-between gap-2 pb-4">
        <div className="flex items-center min-w-[40px]">
          <button
            type="button"
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            aria-label="Back to bookmarks"
          >
            <ArrowLeftIcon size={20} />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center px-2">
          <h2 className="text-mobile-lg font-semibold text-foreground truncate">Folders</h2>
        </div>
        <div className="min-w-[40px]" />
      </div>
      <BookmarkFolderContent bookmarks={bookmarks} folder={folder} />
    </div>
  </div>
);
