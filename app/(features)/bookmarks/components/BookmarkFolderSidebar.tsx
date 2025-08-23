'use client';

import React, { useState } from 'react';
import { Bookmark } from '@/types';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useBookmarkVerse } from '../hooks/useBookmarkVerse';

interface BookmarkFolderSidebarProps {
  bookmarks: Bookmark[];
  folder: { id: string; name: string };
  activeVerseId?: string;
  onVerseSelect?: (verseId: string) => void;
  onBack?: () => void;
}

const FolderIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19.5 21a3 3 0 003-3v-8.625a3 3 0 00-3-3h-3.375l-1.25-1.5h-4.75l-1.25 1.5H3a3 3 0 00-3 3v8.625a3 3 0 003 3h16.5z" />
  </svg>
);

const MoreIcon = () => (
  <svg
    className="w-6 h-6 text-muted"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    className="w-5 h-5 text-muted hover:text-error cursor-pointer"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    className="w-5 h-5 text-muted"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607Z"
    />
  </svg>
);

interface VerseItemProps {
  bookmark: Bookmark;
  isActive: boolean;
  onSelect: () => void;
}

const VerseItem: React.FC<VerseItemProps> = ({ bookmark, isActive, onSelect }) => {
  const { bookmarkWithVerse, isLoading, error } = useBookmarkVerse(
    bookmark.verseId,
    bookmark.createdAt
  );

  if (isLoading || error || !bookmarkWithVerse.verse) {
    return (
      <li className="flex items-center justify-between py-2 px-2 rounded-lg animate-pulse">
        <div className="h-4 bg-interactive rounded w-24" />
        <div className="w-5 h-5 bg-interactive rounded" />
      </li>
    );
  }

  const verse = bookmarkWithVerse.verse;
  const verseDisplayName = `${verse.surahNameEnglish}: ${verse.ayahNumber}`;

  return (
    <li className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-interactive-hover">
      <button
        onClick={onSelect}
        className={`text-foreground hover:text-accent transition-colors ${
          isActive ? 'font-semibold text-accent' : ''
        }`}
      >
        {verseDisplayName}
      </button>
      <TrashIcon />
    </li>
  );
};

export const BookmarkFolderSidebar: React.FC<BookmarkFolderSidebarProps> = ({
  bookmarks,
  folder,
  activeVerseId,
  onVerseSelect,
  onBack,
}) => {
  const { folders } = useBookmarks();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolderId, setExpandedFolderId] = useState<string | null>(folder.id);

  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFolder = (folderId: string) => {
    setExpandedFolderId((currentId) => (currentId === folderId ? null : folderId));
  };

  const handleFolderSelect = (folderId: string) => {
    if (folderId !== folder.id) {
      window.location.href = `/bookmarks/${folderId}`;
    }
  };

  const getFolderColor = (folderId: string) => {
    const colors = [
      'text-green-400',
      'text-purple-400',
      'text-blue-400',
      'text-red-400',
      'text-yellow-400',
    ];
    return colors[parseInt(folderId) % colors.length] || 'text-green-400';
  };

  return (
    <div className="h-full w-full bg-background p-4 font-sans overflow-y-auto">
      <button
        onClick={onBack}
        className="w-full py-3 mb-4 text-lg font-semibold text-foreground bg-surface border border-border rounded-full shadow-sm hover:bg-interactive transition-colors"
      >
        Bookmark
      </button>

      <div className="relative mb-6">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder="Search Bookmark Folder"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-3 pl-11 pr-4 text-foreground bg-surface border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
        />
      </div>

      <div className="space-y-3">
        {filteredFolders.map((folderItem) => {
          const isExpanded = expandedFolderId === folderItem.id;
          const isCurrentFolder = folderItem.id === folder.id;
          const folderBookmarks = isCurrentFolder ? bookmarks : folderItem.bookmarks;
          const handleClick = () =>
            isCurrentFolder ? toggleFolder(folderItem.id) : handleFolderSelect(folderItem.id);

          return (
            <div
              key={folderItem.id}
              className={`rounded-2xl shadow-sm transition-all duration-300 ease-in-out ${
                isExpanded ? 'bg-interactive ring-1 ring-border' : 'bg-surface'
              }`}
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={handleClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleClick();
                }}
              >
                <div className="flex items-center space-x-4">
                  <FolderIcon className={`w-8 h-8 ${getFolderColor(folderItem.id)}`} />
                  <div>
                    <p className="font-bold text-foreground">{folderItem.name}</p>
                    <p className="text-sm text-muted">Total Ayah: {folderBookmarks.length}</p>
                  </div>
                </div>
                <button
                  className="p-2 rounded-full hover:bg-interactive-hover transition-colors"
                  aria-label="Folder options"
                >
                  <MoreIcon />
                </button>
              </div>

              {isExpanded && isCurrentFolder && (
                <div className="px-4 pb-3">
                  <div className="border-t border-border pt-2">
                    {folderBookmarks.length > 0 ? (
                      <ul className="space-y-1">
                        {folderBookmarks.map((bookmark) => (
                          <VerseItem
                            key={bookmark.verseId}
                            bookmark={bookmark}
                            isActive={activeVerseId === bookmark.verseId}
                            onSelect={() => onVerseSelect?.(bookmark.verseId)}
                          />
                        ))}
                      </ul>
                    ) : (
                      <p className="py-4 text-sm text-center text-muted">This folder is empty.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
