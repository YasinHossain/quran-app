'use client';

import React from 'react';

import { BookmarkFolderCard, BookmarkVerseCard } from '@/app/shared/ui/cards';

import type { Bookmark, Folder } from '@/types/bookmark';

interface FolderSectionProps {
  folders: Folder[];
  expandedFolders: Set<string>;
  toggleFolderExpansion: (folderId: string) => void;
  onVerseClick?: ((verseKey: string) => void) | undefined;
}

interface FolderPreviewItemProps {
  bookmark: Bookmark;
  onVerseClick?: ((verseKey: string) => void) | undefined;
}

const FolderPreviewItem = ({
  bookmark,
  onVerseClick,
}: FolderPreviewItemProps): React.JSX.Element => (
  <BookmarkVerseCard
    bookmark={bookmark}
    onClick={() => onVerseClick?.(bookmark.verseKey || bookmark.verseId)}
    className="border border-border/40 bg-surface/80 hover:bg-surface-hover hover:border-accent/30 shadow-sm transition-all duration-200"
  />
);

interface FolderListItemProps {
  folder: Folder;
  isExpanded: boolean;
  onToggleExpansion: (folderId: string) => void;
  onVerseClick?: ((verseKey: string) => void) | undefined;
}

const FolderListItem = ({
  folder,
  isExpanded,
  onToggleExpansion,
  onVerseClick,
}: FolderListItemProps): React.JSX.Element => (
  <div className="space-y-3">
    <BookmarkFolderCard
      folder={folder}
      isExpanded={isExpanded}
      onToggleExpansion={onToggleExpansion}
    />
    {isExpanded && (
      <div className="animate-in fade-in slide-in-from-top-2 rounded-2xl border border-border/40 bg-surface/70 p-3 sm:p-4 shadow-sm">
        <div className="grid gap-2">
          {folder.bookmarks.slice(0, 5).map((bookmark) => (
            <FolderPreviewItem
              key={String(bookmark.verseId)}
              bookmark={bookmark}
              onVerseClick={onVerseClick}
            />
          ))}
        </div>
        {folder.bookmarks.length > 5 ? (
          <div className="mt-3 flex items-center justify-center rounded-xl bg-surface p-2 text-xs font-medium text-muted">
            +{folder.bookmarks.length - 5} more verses
          </div>
        ) : null}
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
    <div className="mb-8">
      <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted">
        Your Folders
      </div>
      <div className="space-y-5">
        {folders.map((folder) => (
          <FolderListItem
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
