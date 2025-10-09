'use client';

import React from 'react';

import { BaseSidebar } from '@/app/shared/components/BaseSidebar';
import { SidebarHeader } from '@/app/shared/components/SidebarHeader';
import { Bookmark, Folder } from '@/types';

import { BookmarkFolderContent } from './BookmarkFolderContent';

interface BookmarkFolderSidebarBaseProps {
  bookmarks: Bookmark[];
  folder: Folder;
  onBack?: (() => void) | undefined;
}

const BookmarkFolderSidebarBody = ({
  bookmarks,
  folder,
  onBack,
}: BookmarkFolderSidebarBaseProps): React.JSX.Element => (
  <div className="flex h-full flex-col">
    <SidebarHeader title="Folder" {...(onBack && { onBack })} showBackButton={!!onBack} />
    <BookmarkFolderContent bookmarks={bookmarks} folder={folder} />
  </div>
);

interface BookmarkFolderSidebarProps extends BookmarkFolderSidebarBaseProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookmarkFolderSidebar = ({
  isOpen,
  onClose,
  ...rest
}: BookmarkFolderSidebarProps): React.JSX.Element => (
  <BaseSidebar
    isOpen={isOpen}
    onClose={onClose}
    position="left"
    aria-label="Bookmark folder navigation"
  >
    <BookmarkFolderSidebarBody {...rest} />
  </BaseSidebar>
);

export const BookmarkFolderSidebarPanel = (
  props: BookmarkFolderSidebarBaseProps
): React.JSX.Element => (
  <div className="flex h-full flex-col border-r border-border bg-surface text-foreground">
    <BookmarkFolderSidebarBody {...props} />
  </div>
);
