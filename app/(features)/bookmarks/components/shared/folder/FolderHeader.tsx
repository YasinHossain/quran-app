'use client';

import React from 'react';

import { FolderGlyph } from '@/app/shared/ui/cards/FolderGlyph';
import { Bookmark, Folder } from '@/types';

interface FolderHeaderProps {
  folderItem: Folder;
  isCurrentFolder: boolean;
  folderBookmarks: Bookmark[];
  onToggle: (folderId: string) => void;
  onSelect: (folderId: string) => void;
}

interface FolderIconProps {
  folderItem: Folder;
}

interface FolderInfoProps {
  folderItem: Folder;
  folderBookmarks: Bookmark[];
}

const FolderIconDisplay = ({ folderItem }: FolderIconProps): React.JSX.Element => (
  <FolderGlyph
    folder={folderItem}
    size="md"
    backgroundOpacity={0.18}
    shadowOpacity={0.5}
    shadowOverride="0 6px 16px -12px"
  />
);

const FolderInfo = ({ folderItem, folderBookmarks }: FolderInfoProps): React.JSX.Element => (
  <div>
    <p className="font-bold text-foreground">{folderItem.name}</p>
    <p className="text-sm text-muted">Total Ayah: {folderBookmarks.length}</p>
  </div>
);

export const FolderHeader = ({
  folderItem,
  isCurrentFolder,
  folderBookmarks,
  onToggle,
  onSelect,
}: FolderHeaderProps): React.JSX.Element => {
  const handleClick = (): void => {
    if (!isCurrentFolder) {
      onSelect(folderItem.id);
    } else {
      onToggle(folderItem.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="flex items-center justify-between p-4 cursor-pointer">
      <div
        className="flex items-center space-x-4 flex-1"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={
          isCurrentFolder ? `Toggle folder ${folderItem.name}` : `Open folder ${folderItem.name}`
        }
        onKeyDown={handleKeyDown}
      >
        <FolderIconDisplay folderItem={folderItem} />
        <FolderInfo folderItem={folderItem} folderBookmarks={folderBookmarks} />
      </div>
    </div>
  );
};
