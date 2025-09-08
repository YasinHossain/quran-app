import { useCallback } from 'react';

import { logger } from '@/src/infrastructure/monitoring/Logger';

import type { UseFolderSettingsSubmitParams } from './types';

export const useFolderSettingsSubmit = ({
  mode,
  folder,
  renameFolder,
  onClose,
  setIsSubmitting,
  name,
  selectedColor,
  selectedIcon,
}: UseFolderSettingsSubmitParams): ((e: React.FormEvent) => Promise<void>) =>
  useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      if (!folder || !name.trim()) return;
      setIsSubmitting(true);
      try {
        if (mode === 'rename' || mode === 'edit' || mode === 'customize') {
          renameFolder(folder.id, name.trim(), selectedColor, selectedIcon);
        }
        onClose();
      } catch (error) {
        logger.error('Failed to update folder:', undefined, error as Error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [folder, mode, name, renameFolder, onClose, selectedColor, selectedIcon, setIsSubmitting],
  );

