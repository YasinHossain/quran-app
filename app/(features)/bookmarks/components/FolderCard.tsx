'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FolderIcon, ArrowLeftIcon } from '@/app/shared/icons';
import { FolderContextMenu } from './FolderContextMenu';
import { Folder } from '@/types';
import { cn } from '@/lib/utils/cn';

interface FolderCardProps {
  folder: Folder;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRename: () => void;
  onColorChange: () => void;
}

export const FolderCard: React.FC<FolderCardProps> = React.memo(function FolderCard({
  folder,
  onClick,
  onEdit,
  onDelete,
  onRename,
  onColorChange,
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="group relative cursor-pointer bg-surface border border-border rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-accent/20 transition-all duration-300 hover:-translate-y-1 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Open folder ${folder.name} with ${folder.bookmarks.length} bookmarks`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
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
              {folder.bookmarks.length} {folder.bookmarks.length === 1 ? 'verse' : 'verses'}
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
          animate={{ width: folder.bookmarks.length > 0 ? '100%' : '25%' }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full"
        />
      </div>

      {/* Last updated info */}
      <div className="mt-3 flex items-center justify-between text-xs text-muted">
        <span>
          {folder.bookmarks.length > 0
            ? `Last added ${new Date().toLocaleDateString()}`
            : 'Empty folder'}
        </span>
      </div>
    </motion.div>
  );
});
