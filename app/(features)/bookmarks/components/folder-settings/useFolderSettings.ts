import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useEscapeKey } from '@/app/providers/hooks/useEscapeKey';

import { DEFAULT_COLOR } from './constants';
import { type UseFolderSettingsParams, type UseFolderSettingsResult } from './types';
import { useFolderSettingsSubmit } from './useFolderSettingsSubmit';
import { useInitializeFolderState } from './useInitializeFolderState';

export const useFolderSettings = ({
  folder,
  onClose,
  isOpen,
  mode,
}: UseFolderSettingsParams): UseFolderSettingsResult => {
  const { t } = useTranslation();
  const { renameFolder, createFolder } = useBookmarks();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEscapeKey(isOpen, onClose);

  useInitializeFolderState({ folder, isOpen, mode, setName, setSelectedColor });

  const handleSubmit = useFolderSettingsSubmit({
    mode,
    folder,
    renameFolder,
    createFolder,
    onClose,
    setIsSubmitting,
    name,
    selectedColor,
  });

  const modalTitle = mode === 'create' ? t('bookmarks_create_folder') : t('edit_folder');
  const submitLabel = mode === 'create' ? t('bookmarks_create_folder') : t('save_changes');
  const submittingLabel = mode === 'create' ? t('creating') : t('saving');

  return {
    name,
    setName,
    selectedColor,
    setSelectedColor,
    isSubmitting,
    handleSubmit,
    getModalTitle: (): string => modalTitle,
    submitLabel,
    submittingLabel,
  };
};
