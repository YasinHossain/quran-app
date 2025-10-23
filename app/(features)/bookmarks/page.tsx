'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';

import { BookmarksHeader } from './components/BookmarksHeader';
import { FolderGrid } from './components/FolderGrid';
import { FolderSettingsModal } from './components/FolderSettingsModal';
import { BookmarksLayout } from './components/shared/BookmarksLayout';
import { useBookmarksPage } from './hooks/useBookmarksPage';

const BookmarksPage = (): React.JSX.Element => {
  const { sortedFolders, handleFolderSelect, handleSectionChange } = useBookmarksPage();
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

  const openCreateFolderModal = (): void => {
    setIsCreateFolderOpen(true);
  };

  const closeCreateFolderModal = (): void => {
    setIsCreateFolderOpen(false);
  };

  return (
    <>
      <FolderSettingsModal
        isOpen={isCreateFolderOpen}
        onClose={closeCreateFolderModal}
        folder={null}
        mode="create"
      />

      <BookmarksLayout activeSection="bookmarks" onSectionChange={handleSectionChange}>
        <BookmarksHeader onNewFolderClick={openCreateFolderModal} />

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
