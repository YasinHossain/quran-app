'use client';

import React from 'react';

import { Bookmark } from '@/types';

import { SidebarHeader } from './bookmark-verse-sidebar/SidebarHeader';
import { VerseList } from './bookmark-verse-sidebar/VerseList';

export interface BookmarkVerseSidebarProps {
  bookmarks: Bookmark[];
  folder: { id: string; name: string };
  activeVerseId?: string;
  onVerseSelect?: (verseId: string) => void;
  onBack?: () => void;
}

export const BookmarkVerseSidebar = ({
  bookmarks,
  folder,
  activeVerseId,
  onVerseSelect,
  onBack,
}: BookmarkVerseSidebarProps): React.JSX.Element => (
  <div className="h-full flex flex-col bg-surface">
    <SidebarHeader folder={folder} bookmarkCount={bookmarks.length} onBack={onBack} />
    <VerseList bookmarks={bookmarks} activeVerseId={activeVerseId} onVerseSelect={onVerseSelect} />
  </div>
);

export { SidebarHeader } from './bookmark-verse-sidebar/SidebarHeader';
export { VerseList } from './bookmark-verse-sidebar/VerseList';
export { VerseItem } from './bookmark-verse-sidebar/VerseItem';
