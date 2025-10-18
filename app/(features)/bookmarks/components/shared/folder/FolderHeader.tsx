'use client';

import React from 'react';

import { colors } from '@/app/shared/design-system/card-tokens';
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
  showDivider?: boolean;
}

interface FolderIconProps {
  folderItem: Folder;
}

interface FolderInfoProps {
  folderItem: Folder;
  folderBookmarks: Bookmark[];
  isCurrentFolder: boolean;
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

const FolderInfo = ({
  folderItem,
  folderBookmarks,
  isCurrentFolder,
}: FolderInfoProps): React.JSX.Element => {
  const verseCount = `${folderBookmarks.length} ${
    folderBookmarks.length === 1 ? 'verse' : 'verses'
  }`;

  return (
    <div className="min-w-0">
      <p
        className={cn(
          'truncate text-sm font-semibold transition-colors duration-200',
          isCurrentFolder ? colors.text.accent : `${colors.text.primary} ${colors.text.hoverAccent}`
        )}
      >
        {folderItem.name}
      </p>
      <p className={cn('text-xs leading-tight transition-colors duration-200', colors.text.secondary)}>
        {verseCount}
      </p>
    </div>
  );
};

export const FolderHeader = ({
  folderItem,
  isCurrentFolder,
  folderBookmarks,
  onToggle,
  onSelect,
  className,
  showDivider = false,
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
      className={cn(
        'relative flex w-full min-h-[80px] items-center gap-4 cursor-pointer px-4 py-4 transition-colors duration-200',
        className
      )}
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
        <FolderInfo
          folderItem={folderItem}
          folderBookmarks={folderBookmarks}
          isCurrentFolder={isCurrentFolder}
        />
      </div>
      {showDivider ? (
        <div className="absolute bottom-0 left-4 right-4 h-px bg-border transition-opacity duration-200" />
      ) : null}
    </div>
  );
};
