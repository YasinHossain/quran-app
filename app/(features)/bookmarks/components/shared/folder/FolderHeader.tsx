'use client';

import React from 'react';

import { FolderGlyph } from '@/app/shared/ui/cards/FolderGlyph';
import { cn } from '@/lib/utils/cn';
import { Bookmark, Folder } from '@/types';

interface FolderHeaderProps {
  folderItem: Folder;
  isCurrentFolder: boolean;
  folderBookmarks: Bookmark[];
  onToggle: (folderId: string) => void;
  onSelect: (folderId: string) => void;
  className?: string;
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
  <div className="min-w-0">
    <p className="truncate text-base font-semibold text-foreground">{folderItem.name}</p>
    <p className="text-xs text-muted">
      {folderBookmarks.length} {folderBookmarks.length === 1 ? 'verse' : 'verses'}
    </p>
  </div>
);

export const FolderHeader = ({
  folderItem,
  isCurrentFolder,
  folderBookmarks,
  onToggle,
  onSelect,
  className,
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
    <div
      className={cn('flex w-full items-center gap-4 cursor-pointer px-4 py-3', className)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={
        isCurrentFolder ? `Toggle folder ${folderItem.name}` : `Open folder ${folderItem.name}`
      }
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <FolderIconDisplay folderItem={folderItem} />
        <FolderInfo folderItem={folderItem} folderBookmarks={folderBookmarks} />
      </div>
    </div>
  );
};
