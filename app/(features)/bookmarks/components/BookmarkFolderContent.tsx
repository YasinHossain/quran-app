'use client';

import React, { useState } from 'react';

import { useFolderNavigation } from '@/app/(features)/bookmarks/hooks/useFolderNavigation';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { Bookmark, Folder } from '@/types';

import { FolderItem } from './shared/folder';

interface BookmarkFolderContentProps {
  bookmarks: Bookmark[];
  folder: Folder;
}

export const BookmarkFolderContent = ({
  bookmarks,
  folder,
}: BookmarkFolderContentProps): React.JSX.Element => {
  const { folders } = useBookmarks();
  const [expandedFolderId, setExpandedFolderId] = useState<string | null>(folder.id);

  const { handleFolderSelect } = useFolderNavigation(folder.id);

  const toggleFolder = (folderId: string): void => {
    setExpandedFolderId((currentId) => (currentId === folderId ? null : folderId));
  };

  const FolderListItem = ({ folderItem }: { folderItem: Folder }): React.JSX.Element => {
    const isExpanded = expandedFolderId === folderItem.id;
    const isCurrentFolder = folderItem.id === folder.id;
    const folderBookmarks = isCurrentFolder ? bookmarks : folderItem.bookmarks;

    return (
      <FolderItem
        key={folderItem.id}
        folderItem={folderItem}
        isExpanded={isExpanded}
        isCurrentFolder={isCurrentFolder}
        folderBookmarks={folderBookmarks}
        onToggle={toggleFolder}
        onSelect={handleFolderSelect}
      />
    );
  };

  return (
    <div className="flex-1 overflow-y-auto px-2 sm:px-3 py-4">
      <div className="space-y-3">
        {folders.map((folderItem) => (
          <FolderListItem key={folderItem.id} folderItem={folderItem} />
        ))}
      </div>
    </div>
  );
};
