'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, Folder } from '@/types';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { FolderIcon, ArrowLeftIcon } from '@/app/shared/icons';
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


export const BookmarkFolderSidebar: React.FC<BookmarkFolderSidebarProps> = ({
  bookmarks,
  folder,
  activeVerseId,
  onVerseSelect,
  onBack,
}) => {
  const { folders } = useBookmarks();
  const [expandedFolderId, setExpandedFolderId] = useState<string | null>(folder.id);

  const router = useRouter();

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
      <div className="bg-background min-h-screen w-full flex flex-col font-sans">
        {/* Header */}
        <div className="flex items-center justify-center px-4 py-6 border-b border-border relative">
          {onBack && (
            <button
              onClick={onBack}
              className="absolute left-4 p-2 rounded-full hover:bg-surface-hover transition-colors"
              aria-label="Go back to bookmarks"
            >
              <ArrowLeftIcon size={20} className="text-foreground" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-foreground">Folder</h1>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          {/* Folders List */}
          <div className="space-y-3">
            {folders.map((folderItem) => {
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
                            : 'This folder is empty.'}
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
