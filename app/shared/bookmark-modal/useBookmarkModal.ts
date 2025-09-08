import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

export interface UseBookmarkModalReturn {
  activeTab: 'bookmark' | 'pin';
  setActiveTab: Dispatch<SetStateAction<'bookmark' | 'pin'>>;
  isCreatingFolder: boolean;
  openCreateFolder: () => void;
  closeCreateFolder: () => void;
  newFolderName: string;
  setNewFolderName: Dispatch<SetStateAction<string>>;
}

export function useBookmarkModal(isOpen: boolean, onClose: () => void): UseBookmarkModalReturn {
  const [activeTab, setActiveTab] = useState<'bookmark' | 'pin'>('pin');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const openCreateFolder = useCallback((): void => setIsCreatingFolder(true), []);
  const closeCreateFolder = useCallback((): void => {
    setIsCreatingFolder(false);
    setNewFolderName('');
  }, []);

  return {
    activeTab,
    setActiveTab,
    isCreatingFolder,
    openCreateFolder,
    closeCreateFolder,
    newFolderName,
    setNewFolderName,
  } as const;
}
