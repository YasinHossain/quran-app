import { useState, useEffect } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { logger } from '@/src/infrastructure/monitoring/Logger';
import { Folder } from '@/types';

interface UseFolderSettingsParams {
  folder: Folder | null;
  mode: 'edit' | 'rename' | 'customize';
  onClose: () => void;
  isOpen: boolean;
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
  const [selectedColor, setSelectedColor] = useState('text-accent');
  const [selectedIcon, setSelectedIcon] = useState('📁');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (folder && isOpen) {
      setName(folder.name);
      setSelectedColor(folder.color || 'text-accent');
      setSelectedIcon(folder.icon || '📁');
    }
  }, [folder, isOpen]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
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

  const getModalTitle = (): string => {
    switch (mode) {
      case 'rename':
        return 'Rename Folder';
      case 'customize':
        return 'Customize Folder';
      case 'edit':
        return 'Edit Folder';
      default:
        return 'Edit Folder';
    }
  };

  return {
    name,
    setName,
    selectedColor,
    setSelectedColor,
    selectedIcon,
    setSelectedIcon,
    isSubmitting,
    handleSubmit,
    getModalTitle,
  };
};
