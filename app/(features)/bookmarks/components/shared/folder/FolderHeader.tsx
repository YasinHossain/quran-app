'use client';

import React from 'react';

import { FolderIcon } from '@/app/shared/icons';
import { cn } from '@/lib/utils/cn';
import { applyOpacity } from '@/app/shared/ui/cards/folderColor.utils';
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

interface FolderActionsProps {
  isCurrentFolder: boolean;
  onToggle: (folderId: string) => void;
  folderId: string;
}

const FolderIconDisplay = ({ folderItem }: FolderIconProps): React.JSX.Element => (
  <div
    className={cn(
      'relative flex h-10 w-10 items-center justify-center rounded-xl text-accent font-semibold'
    )}
    style={{
      backgroundColor: applyOpacity('rgb(var(--color-accent))', 0.1),
      boxShadow: `0 6px 16px -12px ${applyOpacity('rgb(var(--color-accent))', 0.5)}`,
    }}
    aria-hidden="true"
  >
    {folderItem.icon ? (
      <span className={cn('text-base leading-none', folderItem.color || 'text-accent')}>
        {folderItem.icon}
      </span>
    ) : (
      <FolderIcon className="w-5 h-5 text-accent" />
    )}
  </div>
);

const FolderInfo = ({ folderItem, folderBookmarks }: FolderInfoProps): React.JSX.Element => (
  <div>
    <p className="font-bold text-foreground">{folderItem.name}</p>
    <p className="text-sm text-muted">Total Ayah: {folderBookmarks.length}</p>
  </div>
);

const FolderActions = ({
  isCurrentFolder,
  onToggle,
  folderId,
}: FolderActionsProps): React.JSX.Element | null => {
  if (!isCurrentFolder) return null;

  return (
    <button
      className="p-2 rounded-full hover:bg-interactive-hover transition-colors"
      aria-label="Folder options"
      onClick={() => onToggle(folderId)}
    >
      <MoreIcon />
    </button>
  );
};

const MoreIcon = (): React.JSX.Element => (
  <svg
    className="w-6 h-6 text-muted"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
    />
  </svg>
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
      <FolderActions
        isCurrentFolder={isCurrentFolder}
        onToggle={onToggle}
        folderId={folderItem.id}
      />
    </div>
  );
};
