'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, Folder } from '@/types';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { FolderIcon } from '@/app/shared/icons';
import { cn } from '@/lib/utils/cn';

interface BookmarkFolderSidebarProps {
  bookmarks: Bookmark[];
  folder: Folder;
  activeVerseId?: string;
  onVerseSelect?: (verseId: string) => void;
  onBack?: () => void;
}

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
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

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

  const router = useRouter();

  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFolder = (folderId: string) => {
    setExpandedFolderId((currentId) => (currentId === folderId ? null : folderId));
  };

  const handleFolderSelect = (folderId: string) => {
    if (folderId !== folder.id) {
      router.push(`/bookmarks/${folderId}`);
    }
  };


  return (
    <>
      <div className="bg-background min-h-screen w-full flex justify-center p-4 font-sans">
        <div className="w-full max-w-sm">
          {/* Top Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="w-full py-3 mb-4 text-lg font-semibold text-foreground bg-surface border border-border rounded-full shadow-sm hover:bg-interactive transition-colors"
            >
              Bookmark
            </button>
          )}

          {/* Search Bar */}
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
              aria-label="Search bookmark folders"
            />
          </div>

          {/* Folders List */}
          <div className="space-y-3">
            {filteredFolders.map((folderItem) => {
              const isExpanded = expandedFolderId === folderItem.id;
              const isCurrentFolder = folderItem.id === folder.id;
              const folderBookmarks = isCurrentFolder ? bookmarks : folderItem.bookmarks;

              return (
                <div
                  key={folderItem.id}
                  className={`rounded-2xl shadow-sm transition-all duration-300 ease-in-out ${
                    isExpanded ? 'bg-interactive ring-1 ring-border' : 'bg-surface'
                  }`}
                >
                  {/* Folder Header */}
                  <div className="flex items-center justify-between p-4 cursor-pointer">
                    <div
                      className="flex items-center space-x-4 flex-1"
                      onClick={() => {
                        if (!isCurrentFolder) {
                          handleFolderSelect(folderItem.id);
                        } else {
                          toggleFolder(folderItem.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={
                        isCurrentFolder
                          ? `Toggle folder ${folderItem.name}`
                          : `Open folder ${folderItem.name}`
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (!isCurrentFolder) {
                            handleFolderSelect(folderItem.id);
                          } else {
                            toggleFolder(folderItem.id);
                          }
                        }
                      }}
                    >
                      {folderItem.icon ? (
                        <span className={cn('text-2xl', folderItem.color)}>{folderItem.icon}</span>
                      ) : (
                        <FolderIcon className={cn('w-8 h-8', folderItem.color)} />
                      )}
                      <div>
                        <p className="font-bold text-foreground">{folderItem.name}</p>
                        <p className="text-sm text-muted">Total Ayah: {folderBookmarks.length}</p>
                      </div>
                    </div>
                    {isCurrentFolder && (
                      <button
                        className="p-2 rounded-full hover:bg-interactive-hover transition-colors"
                        aria-label="Folder options"
                        onClick={() => toggleFolder(folderItem.id)}
                      >
                        <MoreIcon />
                      </button>
                    )}
                  </div>

                  {/* Expanded Content - Show verse count only */}
                  {isExpanded && isCurrentFolder && (
                    <div className="px-4 pb-3">
                      <div className="border-t border-border pt-2">
                        <p className="py-4 text-sm text-center text-muted">
                          {folderBookmarks.length > 0 
                            ? `${folderBookmarks.length} verse${folderBookmarks.length !== 1 ? 's' : ''} • View in main area`
                            : 'This folder is empty.'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
