'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderCard } from './FolderCard';
import type { Folder } from '@/types';

interface FolderGridProps {
  folders: Folder[];
  onFolderSelect: (folderId: string) => void;
  onFolderMenu?: (folderId: string) => void;
  emptyStateMessage?: string;
}

export const FolderGrid: React.FC<FolderGridProps> = ({
  folders,
  onFolderSelect,
  onFolderMenu,
  emptyStateMessage = 'No folders found for your search.',
}) => {
  if (folders.length === 0) {
    return (
      <div className="mt-10 text-center text-muted">
        <p>{emptyStateMessage}</p>
      </div>
    );
  }

  return (
    <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence>
        {folders.map((folder) => (
          <FolderCard
            key={folder.id}
            name={folder.name}
            count={folder.bookmarks.length}
            onClick={() => onFolderSelect(folder.id)}
            onMenuClick={onFolderMenu ? () => onFolderMenu(folder.id) : undefined}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
