'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { Bookmark, Folder } from '@/types';

import { FolderItem } from './shared/FolderComponents';

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

  const router = useRouter();

  const toggleFolder = (folderId: string): void => {
    setExpandedFolderId((currentId) => (currentId === folderId ? null : folderId));
  };

  const handleFolderSelect = (folderId: string): void => {
    if (folderId !== folder.id) {
      router.push(`/bookmarks/${folderId}`);
    }
  };

  return (
    <div className="flex-1 p-4">
      {/* Folders List */}
      <div className="space-y-3">
        {folders.map((folderItem) => {
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
        })}
      </div>
    </div>
  );
};
