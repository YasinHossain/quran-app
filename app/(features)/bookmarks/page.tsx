'use client';

import React, { useEffect, useState } from 'react';

import { BookmarksHeader } from './components/BookmarksHeader';
import { FolderGrid } from './components/FolderGrid';
import { FolderSettingsModal } from './components/FolderSettingsModal';
import { BookmarksLayout } from './components/shared/BookmarksLayout';
import { useBookmarksPage } from './hooks/useBookmarksPage';

const BookmarksPage = (): React.JSX.Element => {
  const { sortedFolders, handleFolderSelect, handleSectionChange } = useBookmarksPage();
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isGridVisible, setIsGridVisible] = useState(false);

  useEffect(() => {
    setIsGridVisible(true);
  }, []);

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

        <div
          className={`transition-opacity duration-300 ease-out ${
            isGridVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <FolderGrid folders={sortedFolders} onFolderSelect={handleFolderSelect} />
        </div>
      </BookmarksLayout>
    </>
  );
};

export default BookmarksPage;
