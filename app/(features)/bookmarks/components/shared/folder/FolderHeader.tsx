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
    size="lg"
    backgroundOpacity={0.95}
    shadowOpacity={0.25}
    shadowOverride="0 12px 28px -18px"
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
    <div className="min-w-0 flex flex-col">
      <p
        className={cn(
          'truncate text-[1.08rem] leading-[1.1] font-semibold transition-colors duration-200',
          isCurrentFolder ? colors.text.accent : `${colors.text.primary} ${colors.text.hoverAccent}`
        )}
      >
        {folderItem.name}
      </p>
      <p
        className={cn(
          'text-sm leading-[1.1] font-medium transition-colors duration-200 -mt-px',
          colors.text.secondary
        )}
      >
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
        'relative flex w-full min-h-[80px] items-center gap-4 cursor-pointer px-4 py-4 transition-colors duration-200 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border/40 focus-visible:ring-offset-0',
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
    </div>
  );
};
