'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { BookmarksHeader } from './components/BookmarksHeader';
import { FolderGrid } from './components/FolderGrid';
import { BookmarksLayout } from './components/shared/BookmarksLayout';
import { useBookmarksPage } from './hooks/useBookmarksPage';

const BookmarksPage = (): React.JSX.Element => {
  const { sortedFolders, handleFolderSelect, handleSectionChange } = useBookmarksPage();

  return (
    <>
      <BookmarksLayout activeSection="bookmarks" onSectionChange={handleSectionChange}>
        <BookmarksHeader />

        <motion.div
          key="folder-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <FolderGrid folders={sortedFolders} onFolderSelect={handleFolderSelect} />
        </motion.div>
      </BookmarksLayout>
    </>
  );
};

export default BookmarksPage;
