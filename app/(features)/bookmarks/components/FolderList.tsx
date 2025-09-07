'use client';

import React from 'react';

import { Bookmark, Folder } from '@/types';

import { FolderItem } from './shared/folder';

interface FolderListProps {
  folders: Folder[];
  currentFolderId: string;
  expandedFolderId: string | null;
  bookmarks: Bookmark[];
  onToggle: (folderId: string) => void;
  onSelect: (folderId: string) => void;
  activeVerseId?: string;
  onVerseSelect?: (verseId: string) => void;
}

export const FolderList = ({
  folders,
  currentFolderId,
  expandedFolderId,
  bookmarks,
  onToggle,
  onSelect,
  activeVerseId,
  onVerseSelect,
}: FolderListProps): React.JSX.Element => (
  <div className="space-y-3">
    {folders.map((folderItem) => {
      const isExpanded = expandedFolderId === folderItem.id;
      const isCurrentFolder = folderItem.id === currentFolderId;
      const folderBookmarks = isCurrentFolder ? bookmarks : folderItem.bookmarks;

      return (
        <FolderItem
          key={folderItem.id}
          folderItem={folderItem}
          isExpanded={isExpanded}
          isCurrentFolder={isCurrentFolder}
          folderBookmarks={folderBookmarks}
          onToggle={onToggle}
          onSelect={onSelect}
          activeVerseId={activeVerseId}
          onVerseSelect={onVerseSelect}
        />
      );
    })}
  </div>
);
