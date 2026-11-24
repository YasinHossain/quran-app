import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { logger } from '@/src/infrastructure/monitoring/Logger';
import { Folder } from '@/types';

interface DeleteFolderState {
  handleDelete: () => Promise<void>;
  isDeleting: boolean;
  error: string | null;
}

export const useDeleteFolder = (folder: Folder | null, onClose: () => void): DeleteFolderState => {
  const { deleteFolder } = useBookmarks();
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = useCallback(async (): Promise<void> => {
    if (!folder) return;

    setIsDeleting(true);
    setError(null);
    try {
      deleteFolder(folder.id);
      onClose();
    } catch (error) {
      logger.error('Failed to delete folder:', undefined, error as Error);
      setError(t('delete_folder_failed'));
    } finally {
      setIsDeleting(false);
    }
  }, [deleteFolder, folder, onClose, t]);

  return { handleDelete, isDeleting, error };
};

export type UseDeleteFolderReturn = DeleteFolderState;
