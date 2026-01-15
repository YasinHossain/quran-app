import { Dispatch, SetStateAction, useCallback, useState } from 'react';

export interface UseBookmarkModalReturn {
  readonly activeTab: 'bookmark' | 'pin';
  readonly setActiveTab: Dispatch<SetStateAction<'bookmark' | 'pin'>>;
  readonly isCreatingFolder: boolean;
  readonly openCreateFolder: () => void;
  readonly closeCreateFolder: () => void;
  readonly newFolderName: string;
  readonly setNewFolderName: Dispatch<SetStateAction<string>>;
}

export function useBookmarkModal(): UseBookmarkModalReturn {
  const [activeTab, setActiveTab] = useState<'bookmark' | 'pin'>('pin');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const openCreateFolder: () => void = useCallback(() => setIsCreatingFolder(true), []);
  const closeCreateFolder: () => void = useCallback(() => {
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
