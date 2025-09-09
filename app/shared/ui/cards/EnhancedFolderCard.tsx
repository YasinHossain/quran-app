'use client';
import { motion } from 'framer-motion';
import React, { memo } from 'react';

import { FolderContextMenu } from '@/app/(features)/bookmarks/components/FolderContextMenu';
import { FolderIcon } from '@/app/shared/icons';
import { BaseCard, BaseCardProps } from '@/app/shared/ui/BaseCard';
import { cn } from '@/lib/utils/cn';

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

interface FolderIconSectionProps {
  folder: FolderData;
}

const FolderIconSection = memo(function FolderIconSection({
  folder,
}: FolderIconSectionProps): React.JSX.Element {
  return (
    <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 group-hover:from-accent/20 group-hover:to-accent/10 transition-colors duration-300">
      {folder.icon ? (
        <span className={cn('text-2xl', folder.color || 'text-accent')} aria-hidden="true">
          {folder.icon}
        </span>
      ) : (
        <FolderIcon size={28} className={cn(folder.color || 'text-accent')} aria-hidden="true" />
      )}
    </div>
  );
});

interface FolderInfoSectionProps {
  folder: FolderData;
  bookmarkCount: number;
}

const FolderInfoSection = memo(function FolderInfoSection({
  folder,
  bookmarkCount,
}: FolderInfoSectionProps): React.JSX.Element {
  return (
    <div className="flex-1 min-w-0">
      <h3 className="font-bold text-lg text-foreground truncate mb-1 group-hover:text-accent transition-colors duration-200">
        {folder.name}
      </h3>
      <p className="text-sm text-muted font-medium">
        {bookmarkCount} {bookmarkCount === 1 ? 'verse' : 'verses'}
      </p>
    </div>
  );
});

interface FolderHeaderProps {
  folder: FolderData;
  bookmarkCount: number;
  onEdit: () => void;
  onDelete: () => void;
  onRename: () => void;
  onColorChange: () => void;
}

const FolderHeader = memo(function FolderHeader({
  folder,
  bookmarkCount,
  onEdit,
  onDelete,
  onRename,
  onColorChange,
}: FolderHeaderProps): React.JSX.Element {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <FolderIconSection folder={folder} />
        <FolderInfoSection folder={folder} bookmarkCount={bookmarkCount} />
      </div>
      <div className="flex-shrink-0">
        <FolderContextMenu
          onEdit={onEdit}
          onDelete={onDelete}
          onRename={onRename}
          onColorChange={onColorChange}
        />
      </div>
    </div>
  );
});

interface FolderProgressBarProps {
  bookmarkCount: number;
}

const FolderProgressBar = memo(function FolderProgressBar({
  bookmarkCount,
}: FolderProgressBarProps): React.JSX.Element {
  return (
    <div className="w-full h-1.5 bg-surface-hover rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: bookmarkCount > 0 ? '100%' : '25%' }}
        transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
        className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full"
      />
    </div>
  );
});

interface FolderFooterProps {
  bookmarkCount: number;
}

const FolderFooter = memo(function FolderFooter({
  bookmarkCount,
}: FolderFooterProps): React.JSX.Element {
  return (
    <div className="mt-3 flex items-center justify-between text-xs text-muted">
      <span>
        {bookmarkCount > 0 ? `Last added ${new Date().toLocaleDateString()}` : 'Empty folder'}
      </span>
    </div>
  );
});

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
      <FolderProgressBar bookmarkCount={bookmarkCount} />
      <FolderFooter bookmarkCount={bookmarkCount} />
    </BaseCard>
  );
});
