'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FolderIcon, EllipsisHIcon } from '@/app/shared/icons';

interface FolderCardProps {
  name: string;
  count: number;
  onClick: () => void;
  onMenuClick?: () => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({ name, count, onClick, onMenuClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    className="group relative cursor-pointer card hover:shadow-md touch-manipulation"
    onClick={onClick}
  >
    <div className="flex items-center space-x-3">
      <FolderIcon size={24} className="text-accent flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate">{name}</h3>
        <p className="text-sm text-muted">
          {count} {count === 1 ? 'Bookmark' : 'Bookmarks'}
        </p>
      </div>
    </div>
    {onMenuClick && (
      <button
        className="absolute right-2 top-2 rounded-full p-1 text-muted hover:bg-surface/50 group-hover:opacity-100 md:opacity-0 touch-manipulation"
        onClick={(e) => {
          e.stopPropagation();
          onMenuClick();
        }}
        aria-label="Folder options"
      >
        <EllipsisHIcon size={20} />
      </button>
    )}
  </motion.div>
);
