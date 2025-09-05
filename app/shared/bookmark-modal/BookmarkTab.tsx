'use client';

import { motion, AnimatePresence } from 'framer-motion';

import { PlusIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils';

import { CreateFolderForm } from './CreateFolderForm';
import { FolderList } from './FolderList';
import { FolderSearch } from './FolderSearch';
import { BookmarkTabProps } from './types';

export const BookmarkTab = ({
  folders,
  verseId,
  searchQuery,
  isCreatingFolder,
  newFolderName,
  onFolderSelect,
  onCreateFolder,
  onToggleCreateFolder,
  onNewFolderNameChange,
  findBookmark,
}: BookmarkTabProps): JSX.Element => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Search and Create Folder */}
      <div className="px-6 py-4 space-y-4 border-b border-border">
        <FolderSearch
          searchQuery={searchQuery}
          onSearchChange={() => {}} // This will be handled by parent
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

      {/* Folder List */}
      <div className="flex-1 overflow-y-auto p-6">
        <FolderList
          folders={folders}
          verseId={verseId}
          onFolderSelect={onFolderSelect}
          findBookmark={findBookmark}
          emptyMessage={
            searchQuery
              ? 'No folders match your search'
              : 'No folders yet. Create one to get started!'
          }
        />
      </div>
    </div>
  );
};
