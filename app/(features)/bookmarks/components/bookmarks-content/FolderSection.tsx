'use client';

import React from 'react';

import { BookmarkFolderCard, BookmarkVerseCard } from '@/app/shared/ui/cards';

import type { Folder } from '@/types/bookmark';

interface FolderSectionProps {
  folders: Folder[];
  expandedFolders: Set<string>;
  toggleFolderExpansion: (folderId: string) => void;
  onVerseClick?: (verseKey: string) => void;
}

interface FolderItemProps {
  folder: Folder;
  isExpanded: boolean;
  onToggleExpansion: (folderId: string) => void;
  onVerseClick?: (verseKey: string) => void;
}

const FolderItem = ({
  folder,
  isExpanded,
  onToggleExpansion,
  onVerseClick,
}: FolderItemProps): React.JSX.Element => (
  <div className="space-y-1">
    <BookmarkFolderCard
      folder={folder}
      isExpanded={isExpanded}
      onToggleExpansion={onToggleExpansion}
    />
    {isExpanded && (
      <div className="ml-2 pl-3 border-l-2 border-border/50 space-y-2 animate-in slide-in-from-top-2 duration-200">
        {folder.bookmarks.slice(0, 5).map((bookmark) => (
          <BookmarkVerseCard
            key={bookmark.verseId}
            bookmark={bookmark}
            onClick={() => onVerseClick?.(bookmark.verseKey || bookmark.verseId)}
            className="scale-95"
          />
        ))}
        {folder.bookmarks.length > 5 && (
          <div className="text-xs text-muted text-center py-2">
            +{folder.bookmarks.length - 5} more verses
          </div>
        )}
      </div>
    )}
  </div>
);

export const FolderSection = ({
  folders,
  expandedFolders,
  toggleFolderExpansion,
  onVerseClick,
}: FolderSectionProps): React.JSX.Element | null => {
  if (folders.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 px-2">
        Your Folders
      </div>
      <div className="space-y-2">
        {folders.map((folder) => (
          <FolderItem
            key={folder.id}
            folder={folder}
            isExpanded={expandedFolders.has(folder.id)}
            onToggleExpansion={toggleFolderExpansion}
            onVerseClick={onVerseClick}
          />
        ))}
      </div>
    </div>
  );
};
