'use client';

import React from 'react';
import { Bookmark } from '@/types';
import { useBookmarkVerse } from '../hooks/useBookmarkVerse';

interface BookmarkVerseSidebarProps {
  bookmarks: Bookmark[];
  folder: { id: string; name: string };
  activeVerseId?: string;
  onVerseSelect?: (verseId: string) => void;
  onBack?: () => void;
}

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
      <div className="p-3 border-b border-border">
        <div className="animate-pulse">
          <div className="h-4 bg-surface-hover rounded w-16 mb-2"></div>
          <div className="h-3 bg-surface-hover rounded w-24"></div>
        </div>
      </div>
    );
  }

  const verse = bookmarkWithVerse.verse;

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-3 border-b border-border hover:bg-surface-hover transition-colors ${
        isActive ? 'bg-accent/10 border-l-4 border-l-accent' : ''
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-accent">{verse.verse_key}</span>
          <span className="text-xs text-muted">
            {new Date(bookmark.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm font-medium text-foreground truncate">{verse.surahNameEnglish}</p>
        <p className="text-xs text-muted truncate">Ayah {verse.ayahNumber}</p>
      </div>
    </button>
  );
};

export const BookmarkVerseSidebar: React.FC<BookmarkVerseSidebarProps> = ({
  bookmarks,
  folder,
  activeVerseId,
  onVerseSelect,
  onBack,
}) => {
  return (
    <div className="h-full flex flex-col bg-surface">
      {/* Header */}
      <div className="p-4 border-b border-border">
        {onBack && (
          <div className="flex items-center mb-3">
            <button
              onClick={onBack}
              className="p-1 rounded-full hover:bg-surface-hover transition-colors mr-3"
              aria-label="Back to bookmarks"
            >
              <svg
                className="w-5 h-5 text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-sm text-muted">Back to Folders</span>
          </div>
        )}
        <h2 className="text-lg font-semibold text-foreground truncate" title={folder.name}>
          {folder.name}
        </h2>
        <p className="text-sm text-muted mt-1">
          {bookmarks.length} {bookmarks.length === 1 ? 'verse' : 'verses'}
        </p>
      </div>

      {/* Verse List */}
      <div className="flex-1 overflow-y-auto">
        {bookmarks.length === 0 ? (
          <div className="p-4 text-center text-muted">
            <p>No verses in this folder</p>
          </div>
        ) : (
          <div>
            {bookmarks.map((bookmark) => (
              <VerseItem
                key={bookmark.verseId}
                bookmark={bookmark}
                isActive={activeVerseId === bookmark.verseId}
                onSelect={() => onVerseSelect?.(bookmark.verseId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
