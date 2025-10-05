'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { memo } from 'react';

import { CreateFolderForm } from '@/app/shared/bookmark-modal/CreateFolderForm';
import { FolderSearch } from '@/app/shared/bookmark-modal/FolderSearch';
import { PlusIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

interface BookmarkTabHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isCreatingFolder: boolean;
  newFolderName: string;
  onNewFolderNameChange: (name: string) => void;
  onToggleCreateFolder: (creating: boolean) => void;
  onCreateFolder: () => void;
}

export const BookmarkTabHeader = memo(function BookmarkTabHeader({
  searchQuery,
  onSearchChange,
  isCreatingFolder,
  newFolderName,
  onNewFolderNameChange,
  onToggleCreateFolder,
  onCreateFolder,
}: BookmarkTabHeaderProps): React.JSX.Element {
  return (
    <div className="px-6 py-4 space-y-4 border-b border-border">
      <FolderSearch
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        placeholder="Search folders..."
      />

      <AnimatePresence mode="wait">
        {isCreatingFolder ? (
          <CreateFolderForm
            newFolderName={newFolderName}
            onNameChange={onNewFolderNameChange}
            onCreateFolder={onCreateFolder}
            onCancel={() => onToggleCreateFolder(false)}
          />
        ) : (
          <motion.button
            onClick={() => onToggleCreateFolder(true)}
            className={cn(
              'w-full flex items-center justify-center gap-3 p-4 border-2 border-dashed border-border rounded-2xl',
              'hover:border-accent hover:bg-accent/5 transition-colors text-muted hover:text-accent',
              touchClasses.target,
              touchClasses.focus
            )}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <PlusIcon size={20} />
            <span className="font-medium">Create new folder</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
});
