'use client';

import { useCallback } from 'react';

import { createNewFolder } from '@/app/providers/bookmarks/bookmark-utils';
import { Folder } from '@/types';

export interface FolderOperations {
  createFolder: (name: string, color?: string) => void;
  deleteFolder: (folderId: string) => void;
  renameFolder: (folderId: string, newName: string, color?: string) => void;
}

export const useFolderOperations = (
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>
): FolderOperations => {
  const createFolder = useCallback(
    (name: string, color?: string) => {
      const newFolder = createNewFolder(name, color);
      setFolders((prev) => [...prev, newFolder]);
    },
    [setFolders]
  );

  const deleteFolder = useCallback(
    (folderId: string) => {
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
    },
    [setFolders]
  );

  const renameFolder = useCallback(
    (folderId: string, newName: string, color?: string) => {
      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === folderId ? { ...folder, name: newName, ...(color && { color }) } : folder
        )
      );
    },
    [setFolders]
  );

  return { createFolder, deleteFolder, renameFolder };
};

export default useFolderOperations;
