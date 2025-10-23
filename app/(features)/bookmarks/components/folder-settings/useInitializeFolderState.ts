import { useEffect } from 'react';

import { DEFAULT_COLOR, DEFAULT_ICON } from './constants';

import type { InitStateArgs } from './types';

export const useInitializeFolderState = ({
  folder,
  isOpen,
  mode,
  setName,
  setSelectedColor,
  setSelectedIcon,
}: InitStateArgs): void => {
  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && folder) {
      setName(folder.name);
      setSelectedColor(folder.color || DEFAULT_COLOR);
      setSelectedIcon(folder.icon || DEFAULT_ICON);
      return;
    }
    if (mode === 'create') {
      setName('');
      setSelectedColor(DEFAULT_COLOR);
      setSelectedIcon(DEFAULT_ICON);
    }
  }, [folder, isOpen, mode, setName, setSelectedColor, setSelectedIcon]);
};
