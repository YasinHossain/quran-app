'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { FolderGrid } from './components/FolderGrid';
import { BookmarksHeader } from './components/BookmarksHeader';
import { BookmarksLayout } from './components/shared/BookmarksLayout';
import { useBookmarksPage } from './hooks/useBookmarksPage';

const BookmarksPage = (): React.JSX.Element => {
  const {
    folders,
    sortedFolders,
    handleFolderSelect,
    handleSectionChange,
    handleVerseClick,
  } = useBookmarksPage();


  return (
    <>
      <BookmarksLayout
        activeSection="bookmarks"
        onSectionChange={handleSectionChange}
        folders={folders}
        onVerseClick={handleVerseClick}
      >
        <BookmarksHeader />

        <motion.div
          key="folder-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <FolderGrid
            folders={sortedFolders}
            allFolders={sortedFolders}
            onFolderSelect={handleFolderSelect}
          />
        </motion.div>
      </BookmarksLayout>
    </>
  );
};

export default BookmarksPage;
