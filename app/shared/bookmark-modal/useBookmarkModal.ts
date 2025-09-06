import { useCallback, useEffect, useMemo, useState } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { Folder } from '@/types';

export function useBookmarkModal(
  isOpen: boolean,
  verseId: string,
  onClose: () => void
) {
  const {
    folders,
    addBookmark,
    removeBookmark,
    findBookmark,
    togglePinned,
    isPinned,
    createFolder,
  } = useBookmarks();

  const [activeTab, setActiveTab] = useState<'bookmark' | 'pin'>('pin');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const isVersePinned = isPinned(verseId);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) return folders;
    return folders.filter((folder) =>
      folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [folders, searchQuery]);

  const handleFolderSelect = useCallback(
    (folder: Folder) => {
      const existingBookmark = findBookmark(verseId);
      if (existingBookmark && existingBookmark.folder.id === folder.id) {
        removeBookmark(verseId, folder.id);
      } else {
        if (existingBookmark) {
          removeBookmark(verseId, existingBookmark.folder.id);
        }
        addBookmark(verseId, folder.id);
      }
    },
    [verseId, findBookmark, removeBookmark, addBookmark]
  );

  const handleCreateFolder = useCallback(() => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  }, [newFolderName, createFolder]);

  const handleTogglePin = useCallback(() => {
    togglePinned(verseId);
  }, [togglePinned, verseId]);

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    isCreatingFolder,
    setIsCreatingFolder,
    newFolderName,
    setNewFolderName,
    filteredFolders,
    handleFolderSelect,
    handleCreateFolder,
    handleTogglePin,
    isVersePinned,
    findBookmark,
  };
}

