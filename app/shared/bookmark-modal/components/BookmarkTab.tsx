'use client';

import { memo } from 'react';

import { FolderList } from '../FolderList';
import { BookmarkTabProps } from '../types';
import { BookmarkTabHeader } from './BookmarkTabHeader';
import { useBookmarkTab } from '../useBookmarkTab';

export const BookmarkTab = memo(function BookmarkTab({
  verseId,
  isCreatingFolder,
  newFolderName,
  onToggleCreateFolder,
  onNewFolderNameChange,
}: BookmarkTabProps): React.JSX.Element {
  const {
    searchQuery,
    setSearchQuery,
    filteredFolders,
    handleFolderSelect,
    handleCreateFolder,
    findBookmark,
  } = useBookmarkTab({
    verseId,
    newFolderName,
    onNewFolderNameChange,
    onToggleCreateFolder,
  });

  return (
    <div className="flex-1 flex flex-col">
      <BookmarkTabHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isCreatingFolder={isCreatingFolder}
        newFolderName={newFolderName}
        onNewFolderNameChange={onNewFolderNameChange}
        onToggleCreateFolder={onToggleCreateFolder}
        onCreateFolder={handleCreateFolder}
      />
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

