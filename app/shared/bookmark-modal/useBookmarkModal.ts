import { useCallback, useEffect, useState } from 'react';

export function useBookmarkModal(isOpen: boolean, onClose: () => void) {
  const [activeTab, setActiveTab] = useState<'bookmark' | 'pin'>('pin');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const openCreateFolder = useCallback(() => setIsCreatingFolder(true), []);
  const closeCreateFolder = useCallback(() => {
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

