import { useCallback } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { Bookmark, Folder } from '@/types';

interface UseBookmarkTabParams {
  verseId: string;
  verseKey?: string;
  newFolderName: string;
  onNewFolderNameChange: (name: string) => void;
  onToggleCreateFolder: (creating: boolean) => void;
}

export interface UseBookmarkTabReturn {
  readonly folders: Folder[];
  readonly findBookmark: (verseId: string) => { folder: Folder; bookmark: Bookmark } | null;
  readonly handleFolderSelect: (folder: Folder) => void;
  readonly handleCreateFolder: () => void;
}

export function useBookmarkTab({
  verseId,
  verseKey,
  newFolderName,
  onNewFolderNameChange,
  onToggleCreateFolder,
}: UseBookmarkTabParams): UseBookmarkTabReturn {
  const { folders, findBookmark, addBookmark, removeBookmark, createFolder } = useBookmarks();

  const handleFolderSelect = useCallback(
    (folder: Folder): void => {
      const existingBookmark = findBookmark(verseId);
      if (existingBookmark?.folder.id === folder.id) {
        removeBookmark(verseId, folder.id);
      } else {
        if (existingBookmark) removeBookmark(verseId, existingBookmark.folder.id);
        addBookmark(verseId, folder.id, verseKey ? { verseKey } : undefined);
      }
    },
    [verseId, verseKey, findBookmark, removeBookmark, addBookmark]
  );

  const handleCreateFolder = useCallback((): void => {
    if (!newFolderName.trim()) return;
    createFolder(newFolderName.trim());
    onNewFolderNameChange('');
    onToggleCreateFolder(false);
  }, [newFolderName, createFolder, onNewFolderNameChange, onToggleCreateFolder]);

  return {
    folders,
    findBookmark,
    handleFolderSelect,
    handleCreateFolder,
  } as const;
}
