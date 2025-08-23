'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { CreateFolderModal } from './components/CreateFolderModal';
import { BookmarkListView } from './components/BookmarkListView';
import { BookmarksSidebar } from './components/BookmarksSidebar';
import { BookmarksHeader } from './components/BookmarksHeader';
import { FolderGrid } from './components/FolderGrid';
import { useFilteredList } from '@/app/shared/hooks/useFilteredList';
import { useSelection } from '@/app/shared/hooks/useSelection';
import { useModal } from '@/app/shared/hooks/useModal';
import AdaptiveLayout from '@/app/shared/components/AdaptiveLayout';
import { useState } from 'react';
import type { Folder } from '@/types';

const BookmarksPage = () => {
  const { folders } = useBookmarks();
  const modal = useModal();
  const folderSelection = useSelection<Folder>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    filteredItems: filteredFolders,
  } = useFilteredList(folders, {
    searchFields: ['name'],
  });

  const handleFolderSelect = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    if (folder) {
      folderSelection.select(folder);
    }
  };

  const handleBack = () => {
    folderSelection.deselect();
  };

  return (
    <>
      <CreateFolderModal isOpen={modal.isOpen} onClose={modal.close} />
      <AdaptiveLayout
        sidebarContent={<BookmarksSidebar activeSection="bookmarks" />}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        showNavigation={true}
      >
        <main className="flex-1 overflow-y-auto section">
          <AnimatePresence mode="wait">
            {folderSelection.selected ? (
              <BookmarkListView
                key={folderSelection.selected.id}
                folder={folderSelection.selected}
                onBack={handleBack}
              />
            ) : (
              <motion.div
                key="folder-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <BookmarksHeader
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onNewFolderClick={modal.open}
                  onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
                />
                <FolderGrid folders={filteredFolders} onFolderSelect={handleFolderSelect} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </AdaptiveLayout>
    </>
  );
};

export default BookmarksPage;
