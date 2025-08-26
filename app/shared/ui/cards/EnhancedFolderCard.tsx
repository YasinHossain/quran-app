'use client';

import React from 'react';
import { BaseCard, BaseCardProps } from '../BaseCard';
import { FolderIcon } from '@/app/shared/icons';
import { FolderContextMenu } from '@/app/(features)/bookmarks/components/FolderContextMenu';
import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';

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

interface EnhancedFolderCardProps extends Omit<BaseCardProps, 'children'> {
  folder: FolderData;
  onEdit: () => void;
  onDelete: () => void;
  onRename: () => void;
  onColorChange: () => void;
}

export const EnhancedFolderCard: React.FC<EnhancedFolderCardProps> = React.memo(
  function EnhancedFolderCard({
    folder,
    onEdit,
    onDelete,
    onRename,
    onColorChange,
    onClick,
    'aria-label': ariaLabel,
    ...props
  }) {
    const bookmarkCount = Array.isArray(folder.bookmarks)
      ? folder.bookmarks.length
      : folder.bookmarks.length;

    const defaultAriaLabel = `Open folder ${folder.name} with ${bookmarkCount} bookmarks`;

    return (
      <BaseCard
        variant="folder"
        animation="folder"
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel || defaultAriaLabel}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
        }}
        className="relative"
        {...props}
      >
        <div className="flex items-start justify-between mb-4">
          {/* Icon and main content */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 group-hover:from-accent/20 group-hover:to-accent/10 transition-colors duration-300">
              {folder.icon ? (
                <span className={cn('text-2xl', folder.color || 'text-accent')} aria-hidden="true">
                  {folder.icon}
                </span>
              ) : (
                <FolderIcon
                  size={28}
                  className={cn(folder.color || 'text-accent')}
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-foreground truncate mb-1 group-hover:text-accent transition-colors duration-200">
                {folder.name}
              </h3>
              <p className="text-sm text-muted font-medium">
                {bookmarkCount} {bookmarkCount === 1 ? 'verse' : 'verses'}
              </p>
            </div>
          </div>

          {/* Context Menu */}
          <div className="flex-shrink-0">
            <FolderContextMenu
              onEdit={onEdit}
              onDelete={onDelete}
              onRename={onRename}
              onColorChange={onColorChange}
            />
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-surface-hover rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: bookmarkCount > 0 ? '100%' : '25%' }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full"
          />
        </div>

        {/* Last updated info */}
        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <span>
            {bookmarkCount > 0 ? `Last added ${new Date().toLocaleDateString()}` : 'Empty folder'}
          </span>
        </div>
      </BaseCard>
    );
  }
);
