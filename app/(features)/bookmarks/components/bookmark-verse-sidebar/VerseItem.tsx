'use client';

import React from 'react';

import { useBookmarkVerse } from '@/app/(features)/bookmarks/hooks/useBookmarkVerse';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { LoadingError } from '@/app/shared/LoadingError';
import { Bookmark } from '@/types';

interface VerseItemProps {
  bookmark: Bookmark;
  isActive: boolean;
  onSelect: () => void;
}

export const VerseItem = ({ bookmark, isActive, onSelect }: VerseItemProps): React.JSX.Element => {
  const { chapters } = useBookmarks();
  const { bookmark: enrichedBookmark, isLoading, error } = useBookmarkVerse(bookmark, chapters);
  const ayahNumber = enrichedBookmark.verseKey?.split(':')[1];

  return (
    <LoadingError
      isLoading={isLoading || !enrichedBookmark.verseKey || !enrichedBookmark.surahName}
      error={error}
      loadingFallback={
        <div className="p-3 border-b border-border">
          <div className="animate-pulse">
            <div className="h-4 bg-surface-hover rounded w-16 mb-2"></div>
            <div className="h-3 bg-surface-hover rounded w-24"></div>
          </div>
        </div>
      }
      errorFallback={
        <div className="p-3 border-b border-border text-center text-error text-sm">
          Failed to load
        </div>
      }
    >
      <button
        onClick={onSelect}
        className={`w-full text-left p-3 border-b border-border hover:bg-surface-hover transition-colors ${
          isActive ? 'bg-accent/10 border-l-4 border-l-accent' : ''
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-accent">{enrichedBookmark.verseKey}</span>
            <span className="text-xs text-muted">
              {new Date(bookmark.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm font-medium text-foreground truncate">
            {enrichedBookmark.surahName}
          </p>
          <p className="text-xs text-muted truncate">Ayah {ayahNumber}</p>
        </div>
      </button>
    </LoadingError>
  );
};
