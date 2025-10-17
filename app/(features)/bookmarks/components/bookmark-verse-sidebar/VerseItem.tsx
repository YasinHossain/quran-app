'use client';

import React from 'react';

import { useBookmarkVerse } from '@/app/(features)/bookmarks/hooks/useBookmarkVerse';
import { LoadingError } from '@/app/shared/LoadingError';
import { Bookmark } from '@/types';

interface VerseItemProps {
  bookmark: Bookmark;
  onSelect?: (() => void) | undefined;
}

export const VerseItem = ({ bookmark, onSelect }: VerseItemProps): React.JSX.Element => {
  const { bookmark: enrichedBookmark, isLoading, error } = useBookmarkVerse(bookmark);
  const ayahNumber = enrichedBookmark.verseKey?.split(':')[1];
  const wrapperClassName = `w-full text-left p-3 border-b border-border transition-colors${
    onSelect ? ' hover:bg-surface-hover cursor-pointer' : ''
  }`;

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
      {onSelect ? (
        <button onClick={onSelect} type="button" className={wrapperClassName}>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground truncate">
              {enrichedBookmark.surahName}
            </p>
            <p className="text-xs text-muted truncate">Ayah {ayahNumber}</p>
          </div>
        </button>
      ) : (
        <div className={wrapperClassName}>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground truncate">
              {enrichedBookmark.surahName}
            </p>
            <p className="text-xs text-muted truncate">Ayah {ayahNumber}</p>
          </div>
        </div>
      )}
    </LoadingError>
  );
};
