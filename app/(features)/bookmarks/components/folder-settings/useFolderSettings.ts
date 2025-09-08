import React, { useState, useEffect } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useEscapeKey } from '@/app/providers/hooks/useEscapeKey';
import { logger } from '@/src/infrastructure/monitoring/Logger';
import { Folder } from '@/types';

interface UseFolderSettingsParams {
  folder: Folder | null;
  mode: 'edit' | 'rename' | 'customize';
  onClose: () => void;
  isOpen: boolean;
}

const DEFAULT_COLOR = 'text-accent';
const DEFAULT_ICON = '📁';

function getModalTitle(mode: UseFolderSettingsParams['mode']): string {
  switch (mode) {
    case 'rename':
      return 'Rename Folder';
    case 'customize':
      return 'Customize Folder';
    case 'edit':
    default:
      return 'Edit Folder';
  }
}

function createHandleSubmit(params: {
  mode: UseFolderSettingsParams['mode'];
  folder: Folder | null;
  renameFolder: (id: string, name: string, color: string, icon: string) => void;
  onClose: () => void;
  setIsSubmitting: (v: boolean) => void;
  name: string;
  selectedColor: string;
  selectedIcon: string;
}) {
  const {
    mode,
    folder,
    renameFolder,
    onClose,
    setIsSubmitting,
    name,
    selectedColor,
    selectedIcon,
  } = params;
  return async (e: React.FormEvent): Promise<void> => {
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
  };
}

type InitStateArgs = {
  folder: Folder | null;
  isOpen: boolean;
  setName: (v: string) => void;
  setSelectedColor: (v: string) => void;
  setSelectedIcon: (v: string) => void;
};

function useInitializeFolderState({
  folder,
  isOpen,
  setName,
  setSelectedColor,
  setSelectedIcon,
}: InitStateArgs): void {
  useEffect(() => {
    if (folder && isOpen) {
      setName(folder.name);
      setSelectedColor(folder.color || DEFAULT_COLOR);
      setSelectedIcon(folder.icon || DEFAULT_ICON);
    }
  }, [folder, isOpen, setName, setSelectedColor, setSelectedIcon]);
}

export const useFolderSettings = ({
  folder,
  mode,
  onClose,
  isOpen,
}: UseFolderSettingsParams): {
  name: string;
  setName: (name: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  getModalTitle: () => string;
} => {
  const { renameFolder } = useBookmarks();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_ICON);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEscapeKey(isOpen, onClose);

  useInitializeFolderState({ folder, isOpen, setName, setSelectedColor, setSelectedIcon });

  const handleSubmit = createHandleSubmit({
    mode,
    folder,
    renameFolder,
    onClose,
    setIsSubmitting,
    name,
    selectedColor,
    selectedIcon,
  });

  return {
    name,
    setName,
    selectedColor,
    setSelectedColor,
    selectedIcon,
    setSelectedIcon,
    isSubmitting,
    handleSubmit,
    getModalTitle: () => getModalTitle(mode),
  };
};
