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
          inactive:
            'bg-surface-glass/70 backdrop-blur-xl text-content-primary border border-border/20',
          active:
            'bg-surface-glass/80 backdrop-blur-xl text-content-primary border border-border/30',
        },
        hover: {
          effect: 'none',
          value: 'hover:shadow-xl',
          duration: 'transition-all duration-300',
        },
        shadow: {
          inactive: 'shadow-lg',
          active: 'shadow-xl',
        },
      }}
      className="w-full overflow-visible"
    >
      <FolderHeader
        folderItem={folderItem}
        isCurrentFolder={isCurrentFolder}
        folderBookmarks={folderBookmarks}
        onToggle={onToggle}
        onSelect={onSelect}
      />
      <ExpandedContent
        isExpanded={isExpanded && isCurrentFolder}
        folderBookmarks={folderBookmarks}
      />
    </BaseCard>
  );
};
