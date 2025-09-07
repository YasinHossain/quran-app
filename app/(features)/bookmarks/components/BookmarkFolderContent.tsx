'use client';

import React, { useState } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { Bookmark, Folder } from '@/types';

import { FolderList } from './FolderList';
import { useFolderNavigation } from '../hooks/useFolderNavigation';

interface BookmarkFolderContentProps {
  bookmarks: Bookmark[];
  folder: Folder;
  activeVerseId?: string;
  onVerseSelect?: (verseId: string) => void;
}

export const BookmarkFolderContent = ({
  bookmarks,
  folder,
  activeVerseId,
  onVerseSelect,
}: BookmarkFolderContentProps): React.JSX.Element => {
  const { folders } = useBookmarks();
  const [expandedFolderId, setExpandedFolderId] = useState<string | null>(folder.id);

  const { handleFolderSelect } = useFolderNavigation(folder.id);

  const toggleFolder = (folderId: string): void => {
    setExpandedFolderId((currentId) => (currentId === folderId ? null : folderId));
  };

  return (
    <div className="flex-1 p-4">
      {/* Folders List */}
      <FolderList
        folders={folders}
        currentFolderId={folder.id}
        expandedFolderId={expandedFolderId}
        bookmarks={bookmarks}
        onToggle={toggleFolder}
        onSelect={handleFolderSelect}
        activeVerseId={activeVerseId}
        onVerseSelect={onVerseSelect}
      />
    </div>
  );
};
