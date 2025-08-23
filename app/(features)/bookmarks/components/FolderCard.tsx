'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FolderIcon } from '@/app/shared/icons';
import { FolderContextMenu } from './FolderContextMenu';
import { Folder } from '@/types';

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
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="group relative cursor-pointer card hover:shadow-md touch-manipulation"
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
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {folder.icon ? (
            <span className="text-2xl">{folder.icon}</span>
          ) : (
            <FolderIcon
              size={24}
              className={folder.color ? `text-accent ${folder.color}` : 'text-accent'}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{folder.name}</h3>
          <p className="text-sm text-muted">
            {folder.bookmarks.length} {folder.bookmarks.length === 1 ? 'Bookmark' : 'Bookmarks'}
          </p>
        </div>
      </div>

      <FolderContextMenu
        onEdit={onEdit}
        onDelete={onDelete}
        onRename={onRename}
        onColorChange={onColorChange}
      />
    </motion.div>
  );
});
