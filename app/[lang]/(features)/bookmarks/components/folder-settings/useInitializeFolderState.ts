import { useEffect } from 'react';

import { DEFAULT_COLOR } from './constants';

import type { InitStateArgs } from './types';

export const useInitializeFolderState = ({
  folder,
  isOpen,
  mode,
  setName,
  setSelectedColor,
}: InitStateArgs): void => {
  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && folder) {
      setName(folder.name);
      setSelectedColor(folder.color || DEFAULT_COLOR);
      return;
    }
    if (mode === 'create') {
      setName('');
      setSelectedColor(DEFAULT_COLOR);
    }
  }, [folder, isOpen, mode, setName, setSelectedColor]);
};
