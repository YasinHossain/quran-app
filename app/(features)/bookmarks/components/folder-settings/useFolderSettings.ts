import { useState } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useEscapeKey } from '@/app/providers/hooks/useEscapeKey';

import { DEFAULT_COLOR, DEFAULT_ICON } from './constants';
import { type UseFolderSettingsParams, type UseFolderSettingsResult } from './types';
import { useFolderSettingsSubmit } from './useFolderSettingsSubmit';
import { useInitializeFolderState } from './useInitializeFolderState';

export const useFolderSettings = ({
  folder,
  onClose,
  isOpen,
  mode,
}: UseFolderSettingsParams): UseFolderSettingsResult => {
  const { renameFolder, createFolder } = useBookmarks();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_ICON);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEscapeKey(isOpen, onClose);

  useInitializeFolderState({ folder, isOpen, mode, setName, setSelectedColor, setSelectedIcon });

  const handleSubmit = useFolderSettingsSubmit({
    mode,
    folder,
    renameFolder,
    createFolder,
    onClose,
    setIsSubmitting,
    name,
    selectedColor,
    selectedIcon,
  });

  const modalTitle = mode === 'create' ? 'Create Folder' : 'Edit Folder';
  const submitLabel = mode === 'create' ? 'Create Folder' : 'Save Changes';
  const submittingLabel = mode === 'create' ? 'Creating...' : 'Saving...';

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
    submitLabel,
    submittingLabel,
  };
};
