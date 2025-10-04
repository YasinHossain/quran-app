import { useCallback, useMemo, useState } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { Bookmark, Folder } from '@/types';

interface UseBookmarkTabParams {
  verseId: string;
  newFolderName: string;
  onNewFolderNameChange: (name: string) => void;
  onToggleCreateFolder: (creating: boolean) => void;
}

export interface UseBookmarkTabReturn {
  readonly folders: Folder[];
  readonly filteredFolders: Folder[];
  readonly findBookmark: (verseId: string) => { folder: Folder; bookmark: Bookmark } | null;
  readonly searchQuery: string;
  readonly setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  readonly handleFolderSelect: (folder: Folder) => void;
  readonly handleCreateFolder: () => void;
}

export function useBookmarkTab({
  verseId,
  newFolderName,
  onNewFolderNameChange,
  onToggleCreateFolder,
}: UseBookmarkTabParams): UseBookmarkTabReturn {
  const { folders, findBookmark, addBookmark, removeBookmark, createFolder } = useBookmarks();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFolders = useMemo<Folder[]>(() => {
    if (!searchQuery.trim()) return folders;
    return folders.filter((folder) =>
      folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [folders, searchQuery]);

  const handleFolderSelect = useCallback(
    (folder: Folder): void => {
      const existingBookmark = findBookmark(verseId);
      if (existingBookmark?.folder.id === folder.id) {
        removeBookmark(verseId, folder.id);
      } else {
        if (existingBookmark) removeBookmark(verseId, existingBookmark.folder.id);
        addBookmark(verseId, folder.id);
      }
    },
    [verseId, findBookmark, removeBookmark, addBookmark]
  );

  const handleCreateFolder = useCallback((): void => {
    if (!newFolderName.trim()) return;
    createFolder(newFolderName.trim());
    onNewFolderNameChange('');
    onToggleCreateFolder(false);
  }, [newFolderName, createFolder, onNewFolderNameChange, onToggleCreateFolder]);

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
