'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { memo, useCallback, useMemo, useState } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { PlusIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';
import { Folder } from '@/types';

import { CreateFolderForm } from '../CreateFolderForm';
import { FolderList } from '../FolderList';
import { FolderSearch } from '../FolderSearch';
import { BookmarkTabProps } from '../types';

export const BookmarkTab = memo(function BookmarkTab({
  verseId,
  isCreatingFolder,
  newFolderName,
  onToggleCreateFolder,
  onNewFolderNameChange,
}: BookmarkTabProps): React.JSX.Element {
  const { folders, findBookmark, addBookmark, removeBookmark, createFolder } =
    useBookmarks();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) return folders;
    return folders.filter((folder) =>
      folder.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [folders, searchQuery]);

  const handleFolderSelect = useCallback(
    (folder: Folder) => {
      const existingBookmark = findBookmark(verseId);
      if (existingBookmark && existingBookmark.folder.id === folder.id) {
        removeBookmark(verseId, folder.id);
      } else {
        if (existingBookmark) {
          removeBookmark(verseId, existingBookmark.folder.id);
        }
        addBookmark(verseId, folder.id);
      }
    },
    [verseId, findBookmark, removeBookmark, addBookmark],
  );

  const handleCreateFolder = useCallback(() => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      onNewFolderNameChange('');
      onToggleCreateFolder(false);
    }
  }, [newFolderName, createFolder, onNewFolderNameChange, onToggleCreateFolder]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Search and Create Folder */}
      <div className="px-6 py-4 space-y-4 border-b border-border">
        <FolderSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search folders..."
        />

        <AnimatePresence mode="wait">
          {isCreatingFolder ? (
            <CreateFolderForm
              newFolderName={newFolderName}
              onNameChange={onNewFolderNameChange}
              onCreateFolder={handleCreateFolder}
              onCancel={() => onToggleCreateFolder(false)}
            />
          ) : (
            <motion.button
              onClick={() => onToggleCreateFolder(true)}
              className={cn(
                'w-full flex items-center justify-center gap-3 p-4 border-2 border-dashed border-border rounded-2xl',
                'hover:border-accent hover:bg-accent/5 transition-colors text-muted hover:text-accent',
                touchClasses.target,
                touchClasses.focus,
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
          folders={filteredFolders}
          verseId={verseId}
          onFolderSelect={handleFolderSelect}
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
});

