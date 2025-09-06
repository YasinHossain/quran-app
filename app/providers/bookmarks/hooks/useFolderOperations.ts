'use client';

import { useCallback } from 'react';

import { Folder } from '@/types';

import { createNewFolder } from '../bookmark-utils';

export interface FolderOperations {
  createFolder: (name: string, color?: string, icon?: string) => void;
  deleteFolder: (folderId: string) => void;
  renameFolder: (folderId: string, newName: string, color?: string, icon?: string) => void;
}

export const useFolderOperations = (
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>
): FolderOperations => {
  const createFolder = useCallback(
    (name: string, color?: string, icon?: string) => {
      const newFolder = createNewFolder(name, color, icon);
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
    (folderId: string, newName: string, color?: string, icon?: string) => {
      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === folderId
            ? { ...folder, name: newName, ...(color && { color }), ...(icon && { icon }) }
            : folder
        )
      );
    },
    [setFolders]
  );

  return { createFolder, deleteFolder, renameFolder };
};

export default useFolderOperations;
