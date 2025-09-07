'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';

import { CreateFolderModal } from './components/CreateFolderModal';
import { FolderGrid } from './components/FolderGrid';
import { BookmarksHeader } from './components/BookmarksHeader';
import { BookmarksLayout } from './components/shared/BookmarksLayout';
import { useBookmarksPage } from './hooks/useBookmarksPage';

const BookmarksPage = (): React.JSX.Element => {
  const {
    folders,
    sortedFolders,
    modal,
    handleFolderSelect,
    handleSectionChange,
    handleVerseClick,
  } = useBookmarksPage();

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (term: string): void => {
    setSearchTerm(term);
  };

  const handleClearSearch = (): void => {
    setSearchTerm('');
  };

  const filteredFolders = sortedFolders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <CreateFolderModal isOpen={modal.isOpen} onClose={modal.close} />

      <BookmarksLayout
        activeSection="bookmarks"
        onSectionChange={handleSectionChange}
        folders={folders}
        onVerseClick={handleVerseClick}
      >
        <BookmarksHeader
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onNewFolderClick={modal.open}
        />

        <motion.div
          key="folder-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <FolderGrid
            folders={filteredFolders}
            allFolders={sortedFolders}
            onFolderSelect={handleFolderSelect}
            onCreateFolder={modal.open}
            searchTerm={searchTerm}
            onClearSearch={handleClearSearch}
          />
        </motion.div>
      </BookmarksLayout>
    </>
  );
};

export default BookmarksPage;
