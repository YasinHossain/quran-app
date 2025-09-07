import { useCallback, useState } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { logger } from '@/src/infrastructure/monitoring/Logger';
import { Folder } from '@/types';

export const useDeleteFolder = (folder: Folder | null, onClose: () => void) => {
  const { deleteFolder } = useBookmarks();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!folder) return;

    setIsDeleting(true);
    try {
      deleteFolder(folder.id);
      onClose();
    } catch (error) {
      logger.error('Failed to delete folder:', undefined, error as Error);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteFolder, folder, onClose]);

  return { handleDelete, isDeleting };
};

export type UseDeleteFolderReturn = ReturnType<typeof useDeleteFolder>;
