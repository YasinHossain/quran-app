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
  const { folders, addBookmark, removeBookmark, createFolder } = useBookmarks();

  const handleFolderSelect = useCallback(
    (folder: Folder): void => {
      const isAlreadySelected = folder.bookmarks.some(
        (bookmark: Bookmark) => String(bookmark.verseId) === String(verseId)
      );
      if (isAlreadySelected) {
        removeBookmark(verseId, folder.id);
      } else {
        addBookmark(verseId, folder.id, verseKey ? { verseKey } : undefined);
      }
    },
    [verseId, verseKey, removeBookmark, addBookmark]
  );

  const handleCreateFolder = useCallback((): void => {
    if (!newFolderName.trim()) return;
    createFolder(newFolderName.trim());
    onNewFolderNameChange('');
    onToggleCreateFolder(false);
  }, [newFolderName, createFolder, onNewFolderNameChange, onToggleCreateFolder]);

  return {
    folders,
    handleFolderSelect,
    handleCreateFolder,
  } as const;
}
