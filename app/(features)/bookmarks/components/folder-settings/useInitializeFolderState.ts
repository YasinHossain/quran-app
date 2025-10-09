import { useEffect } from 'react';

import { DEFAULT_COLOR, DEFAULT_ICON } from './constants';

import type { InitStateArgs } from './types';

export const useInitializeFolderState = ({
  folder,
  isOpen,
  setName,
  setSelectedColor,
  setSelectedIcon,
}: InitStateArgs): void => {
  useEffect(() => {
    if (folder && isOpen) {
      setName(folder.name);
      setSelectedColor(folder.color || DEFAULT_COLOR);
      setSelectedIcon(folder.icon || DEFAULT_ICON);
    }
  }, [folder, isOpen, setName, setSelectedColor, setSelectedIcon]);
};
