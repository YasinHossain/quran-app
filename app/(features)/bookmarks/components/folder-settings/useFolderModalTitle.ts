import { useMemo } from 'react';

import type { FolderSettingsMode } from './types';

export const useFolderModalTitle = (mode: FolderSettingsMode): string =>
  useMemo((): string => {
    switch (mode) {
      case 'rename':
        return 'Rename Folder';
      case 'customize':
        return 'Customize Folder';
      case 'edit':
      default:
        return 'Edit Folder';
    }
  }, [mode]);

