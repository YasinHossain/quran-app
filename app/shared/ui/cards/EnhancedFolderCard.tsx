'use client';
import React, { memo } from 'react';

import { BaseCard, BaseCardProps } from '@/app/shared/ui/BaseCard';

import { FolderHeader } from './FolderHeader';
import { FolderProgress } from './FolderProgress';

/**
 * EnhancedFolderCard
 *
 * Maintains the exact visual design of the current FolderCard
 * while using the unified BaseCard system underneath.
 */

interface FolderData {
  name: string;
  icon?: string;
  color?: string;
  bookmarks: Array<{ verseId: string; verseKey?: string }> | { length: number };
}

interface EnhancedFolderCardProps extends Omit<BaseCardProps, 'children' | 'onClick'> {
  folder: FolderData;
  onEdit: () => void;
  onDelete: () => void;
  onRename: () => void;
  onColorChange: () => void;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export const EnhancedFolderCard = memo(function EnhancedFolderCard({
  folder,
  onEdit,
  onDelete,
  onRename,
  onColorChange,
  onClick,
  'aria-label': ariaLabel,
  ...props
}: EnhancedFolderCardProps): React.JSX.Element {
  const bookmarkCount = Array.isArray(folder.bookmarks)
    ? folder.bookmarks.length
    : folder.bookmarks.length;

  const defaultAriaLabel = `Open folder ${folder.name} with ${bookmarkCount} bookmarks`;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(e as unknown as React.MouseEvent<HTMLElement>);
    }
  };

  return (
    <BaseCard
      variant="folder"
      animation="folder"
      onClick={onClick as React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement> | undefined}
      role="button"
      tabIndex={0}
      aria-label={(ariaLabel || defaultAriaLabel) as string}
      onKeyDown={handleKeyDown}
      className="relative"
      {...props}
    >
      <FolderHeader
        folder={folder}
        bookmarkCount={bookmarkCount}
        onEdit={onEdit}
        onDelete={onDelete}
        onRename={onRename}
        onColorChange={onColorChange}
      />
      <FolderProgress bookmarkCount={bookmarkCount} />
    </BaseCard>
  );
});
