import { useCallback, useMemo, useState } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { Folder } from '@/types';

interface UseBookmarkTabParams {
  verseId: string;
  newFolderName: string;
  onNewFolderNameChange: (name: string) => void;
  onToggleCreateFolder: (creating: boolean) => void;
}

export function useBookmarkTab({
  verseId,
  newFolderName,
  onNewFolderNameChange,
  onToggleCreateFolder,
}: UseBookmarkTabParams) {
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
      if (existingBookmark?.folder.id === folder.id) {
        removeBookmark(verseId, folder.id);
      } else {
        if (existingBookmark)
          removeBookmark(verseId, existingBookmark.folder.id);
        addBookmark(verseId, folder.id);
      }
    },
    [verseId, findBookmark, removeBookmark, addBookmark],
  );

  const handleCreateFolder = useCallback(() => {
    if (!newFolderName.trim()) return;
    createFolder(newFolderName.trim());
    onNewFolderNameChange('');
    onToggleCreateFolder(false);
  }, [
    newFolderName,
    createFolder,
    onNewFolderNameChange,
    onToggleCreateFolder,
  ]);

  return {
    folders,
    filteredFolders,
    findBookmark,
    searchQuery,
    setSearchQuery,
    handleFolderSelect,
    handleCreateFolder,
  } as const;
}

