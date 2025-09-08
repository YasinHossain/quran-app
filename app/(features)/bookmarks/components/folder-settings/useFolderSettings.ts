import { useState } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useEscapeKey } from '@/app/providers/hooks/useEscapeKey';

import { DEFAULT_COLOR, DEFAULT_ICON } from './constants';
import { type UseFolderSettingsParams, type UseFolderSettingsResult } from './types';
import { useFolderModalTitle } from './useFolderModalTitle';
import { useFolderSettingsSubmit } from './useFolderSettingsSubmit';
import { useInitializeFolderState } from './useInitializeFolderState';

export const useFolderSettings = ({
  folder,
  mode,
  onClose,
  isOpen,
}: UseFolderSettingsParams): UseFolderSettingsResult => {
  const { renameFolder } = useBookmarks();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_ICON);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEscapeKey(isOpen, onClose);

  useInitializeFolderState({ folder, isOpen, setName, setSelectedColor, setSelectedIcon });

  const handleSubmit = useFolderSettingsSubmit({
    mode,
    folder,
    renameFolder,
    onClose,
    setIsSubmitting,
    name,
    selectedColor,
    selectedIcon,
  });

  const modalTitle = useFolderModalTitle(mode);

  return {
    name,
    setName,
    selectedColor,
    setSelectedColor,
    selectedIcon,
    setSelectedIcon,
    isSubmitting,
    handleSubmit,
    getModalTitle: (): string => modalTitle,
  };
};
