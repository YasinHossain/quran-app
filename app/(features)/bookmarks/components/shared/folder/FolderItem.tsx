'use client';

import React from 'react';

import { BaseCard } from '@/app/shared/ui/BaseCard';
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
}

export const FolderItem = ({
  folderItem,
  isExpanded,
  isCurrentFolder,
  folderBookmarks,
  onToggle,
  onSelect,
}: FolderItemProps): React.JSX.Element => {
  const shouldShowExpanded = isExpanded && isCurrentFolder;

  return (
    <BaseCard
      variant="navigation"
      animation="navigation"
      isActive={isCurrentFolder}
      direction="column"
      align="start"
      gap="gap-0"
      customVariant={{
        height: 'min-h-[80px]',
        padding: 'p-0',
        background: {
          inactive: 'bg-surface border border-border/40',
          active: 'bg-surface border border-border/40',
        },
        shadow: {
          inactive: 'shadow-sm',
          active: 'shadow-sm',
        },
        hover: {
          effect: 'none',
          value: 'hover:bg-surface-hover hover:border-border/60',
          duration: 'transition-colors duration-200',
        },
      }}
      className="w-full overflow-hidden"
    >
      <FolderHeader
        folderItem={folderItem}
        isCurrentFolder={isCurrentFolder}
        folderBookmarks={folderBookmarks}
        onToggle={onToggle}
        onSelect={onSelect}
        className="w-full min-h-[80px]"
      />
      <ExpandedContent isExpanded={shouldShowExpanded} folderBookmarks={folderBookmarks} />
    </BaseCard>
  );
};
