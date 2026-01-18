'use client';

import React, { useEffect, useState } from 'react';

import { BookmarksHeader } from '@/app/(features)/bookmarks/components/BookmarksHeader';
import { FolderGrid } from '@/app/(features)/bookmarks/components/FolderGrid';
import { FolderSettingsModal } from '@/app/(features)/bookmarks/components/FolderSettingsModal';
import { BookmarksLayout } from '@/app/(features)/bookmarks/components/shared/BookmarksLayout';
import { useBookmarksPage } from '@/app/(features)/bookmarks/hooks/useBookmarksPage';

const BookmarksPage = (): React.JSX.Element => {
  const { sortedFolders, handleSectionChange } = useBookmarksPage();
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
          className={`transition-opacity duration-300 ease-out ${isGridVisible ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <FolderGrid folders={sortedFolders} />
        </div>
      </BookmarksLayout>
    </>
  );
};

export default BookmarksPage;
