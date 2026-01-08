'use client';

import React from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
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

const folderNavigationCardVariant = {
  height: 'min-h-[80px]',
  padding: 'p-0',
  background: {
    // Use solid colors like Surah navigation cards for better performance (no backdrop-blur)
    inactive:
      'bg-surface-navigation text-content-primary border border-border/30 dark:border-border/20',
    active:
      'bg-surface-navigation text-content-primary border border-border/40 dark:border-border/30',
  },
  hover: {
    effect: 'none',
    value: 'hover:shadow-lg',
    duration: 'transition-all duration-300',
  },
  shadow: {
    inactive: 'shadow-md',
    active: 'shadow-lg',
  },
} as const;

export const FolderItem = ({
  folderItem,
  isExpanded,
  isCurrentFolder,
  folderBookmarks,
  onToggle,
  onSelect,
}: FolderItemProps): React.JSX.Element => {
  const { removeBookmark } = useBookmarks();
  const handleRemoveBookmark = React.useCallback(
    (bookmark: Bookmark): void => {
      removeBookmark(bookmark.verseId, folderItem.id);
    },
    [removeBookmark, folderItem.id]
  );
  const shouldShowExpanded = isExpanded && isCurrentFolder;

  return (
    <BaseCard
      variant="navigation"
      animation="navigation"
      isActive={isCurrentFolder}
      direction="column"
      align="start"
      customVariant={folderNavigationCardVariant}
      gap="gap-0"
      className="w-full overflow-visible"
    >
      <FolderHeader
        folderItem={folderItem}
        isCurrentFolder={isCurrentFolder}
        folderBookmarks={folderBookmarks}
        onToggle={onToggle}
        onSelect={onSelect}
        showDivider={shouldShowExpanded}
      />
      <ExpandedContent
        isExpanded={shouldShowExpanded}
        folderBookmarks={folderBookmarks}
        onRemoveBookmark={handleRemoveBookmark}
      />
    </BaseCard>
  );
};
