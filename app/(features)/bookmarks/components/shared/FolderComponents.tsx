'use client';

import React from 'react';

import { FolderIcon } from '@/app/shared/icons';
import { cn } from '@/lib/utils/cn';
import { Bookmark, Folder } from '@/types';

interface FolderHeaderProps {
  folderItem: Folder;
  isCurrentFolder: boolean;
  folderBookmarks: Bookmark[];
  onToggle: (folderId: string) => void;
  onSelect: (folderId: string) => void;
}

interface ExpandedContentProps {
  isExpanded: boolean;
  isCurrentFolder: boolean;
  folderBookmarks: Bookmark[];
}

interface FolderItemProps {
  folderItem: Folder;
  isExpanded: boolean;
  isCurrentFolder: boolean;
  folderBookmarks: Bookmark[];
  onToggle: (folderId: string) => void;
  onSelect: (folderId: string) => void;
}

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
        {folderItem.icon ? (
          <span className={cn('text-2xl', folderItem.color)}>{folderItem.icon}</span>
        ) : (
          <FolderIcon className={cn('w-8 h-8', folderItem.color)} />
        )}
        <div>
          <p className="font-bold text-foreground">{folderItem.name}</p>
          <p className="text-sm text-muted">Total Ayah: {folderBookmarks.length}</p>
        </div>
      </div>
      {isCurrentFolder && (
        <button
          className="p-2 rounded-full hover:bg-interactive-hover transition-colors"
          aria-label="Folder options"
          onClick={() => onToggle(folderItem.id)}
        >
          <MoreIcon />
        </button>
      )}
    </div>
  );
};

export const ExpandedContent = ({
  isExpanded,
  isCurrentFolder,
  folderBookmarks,
}: ExpandedContentProps): React.JSX.Element | null => {
  if (!isExpanded || !isCurrentFolder) return null;

  return (
    <div className="px-4 pb-3">
      <div className="border-t border-border pt-2">
        <p className="py-4 text-sm text-center text-muted">
          {folderBookmarks.length > 0
            ? `${folderBookmarks.length} verse${folderBookmarks.length !== 1 ? 's' : ''} • View in main area`
            : 'This folder is empty.'}
        </p>
      </div>
    </div>
  );
};

export const FolderItem = ({
  folderItem,
  isExpanded,
  isCurrentFolder,
  folderBookmarks,
  onToggle,
  onSelect,
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
    />
  </div>
);
