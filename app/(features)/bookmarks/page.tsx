'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { CreateFolderModal } from './components/CreateFolderModal';
import { FolderGrid } from './components/FolderGrid';
import { BookmarksLayout } from './components/shared/BookmarksLayout';
import { BookmarksPageHeader } from './components/shared/BookmarksPageHeader';
import { useBookmarksPage } from './hooks/useBookmarksPage';

const BookmarksPage = () => {
  const {
    folders,
    sortedFolders,
    modal,
    handleFolderSelect,
    handleSectionChange,
    handleVerseClick,
  } = useBookmarksPage();

  return (
    <>
      <CreateFolderModal isOpen={modal.isOpen} onClose={modal.close} />

      <BookmarksLayout
        activeSection="bookmarks"
        onSectionChange={handleSectionChange}
        folders={folders}
        onVerseClick={handleVerseClick}
      >
        <BookmarksPageHeader />

        <motion.div
          key="folder-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <FolderGrid
            folders={sortedFolders}
            allFolders={folders}
            onFolderSelect={handleFolderSelect}
            onCreateFolder={modal.open}
            searchTerm=""
            onClearSearch={() => {}}
          />
        </motion.div>
      </BookmarksLayout>
    </>
  );
};

export default BookmarksPage;
