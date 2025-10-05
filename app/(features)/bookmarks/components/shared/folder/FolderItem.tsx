'use client';

import React from 'react';

import { Bookmark, Folder } from '@/types';

import { ExpandedContent } from './ExpandedContent';
import { FolderHeader } from './FolderHeader';

interface FolderItemProps {
  folderItem: Folder;
  isExpanded: boolean;
  isCurrentFolder: boolean;
  folderBookmarks: Bookmark[];
  onToggle: (folderId: string) => void;
  onSelect: (folderId: string) => void;
  activeVerseId?: string | undefined;
  onVerseSelect?: ((verseId: string) => void) | undefined;
}

export const FolderItem = ({
  folderItem,
  isExpanded,
  isCurrentFolder,
  folderBookmarks,
  onToggle,
  onSelect,
  activeVerseId,
  onVerseSelect,
}: FolderItemProps): React.JSX.Element => (
  <div
    className={`rounded-2xl shadow-sm transition-all duration-300 ease-in-out ${
      isExpanded ? 'bg-interactive ring-1 ring-border' : 'bg-surface'
    }`}
  >
    <FolderHeader
      folderItem={folderItem}
      isCurrentFolder={isCurrentFolder}
      folderBookmarks={folderBookmarks}
      onToggle={onToggle}
      onSelect={onSelect}
    />
    <ExpandedContent
      isExpanded={isExpanded}
      isCurrentFolder={isCurrentFolder}
      folderBookmarks={folderBookmarks}
      activeVerseId={activeVerseId}
      onVerseSelect={onVerseSelect}
    />
  </div>
);
