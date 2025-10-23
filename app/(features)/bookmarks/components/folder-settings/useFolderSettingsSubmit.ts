import { useCallback } from 'react';

import { logger } from '@/src/infrastructure/monitoring/Logger';

import type { UseFolderSettingsSubmitParams } from './types';

export const useFolderSettingsSubmit = ({
  mode,
  folder,
  renameFolder,
  createFolder,
  onClose,
  setIsSubmitting,
  name,
  selectedColor,
  selectedIcon,
}: UseFolderSettingsSubmitParams): ((e: React.FormEvent) => Promise<void>) =>
  useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      if (!name.trim()) return;
      if (mode === 'edit' && !folder) return;
      setIsSubmitting(true);
      try {
        if (mode === 'create') {
          createFolder(name.trim(), selectedColor, selectedIcon);
        } else if (folder) {
          renameFolder(folder.id, name.trim(), selectedColor, selectedIcon);
        }
        onClose();
      } catch (error) {
        const action = mode === 'create' ? 'create folder' : 'update folder';
        logger.error(`Failed to ${action}:`, undefined, error as Error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      mode,
      folder,
      name,
      renameFolder,
      createFolder,
      onClose,
      selectedColor,
      selectedIcon,
      setIsSubmitting,
    ]
  );
