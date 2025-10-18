'use client';

import React from 'react';

import { useBookmarkVerse } from '@/app/(features)/bookmarks/hooks/useBookmarkVerse';
import { LoadingError } from '@/app/shared/LoadingError';
import { cn } from '@/lib/utils/cn';
import { Bookmark } from '@/types';

interface VerseItemProps {
  bookmark: Bookmark;
  onSelect?: (() => void) | undefined;
  showDivider?: boolean;
}

export const VerseItem = ({
  bookmark,
  onSelect,
  showDivider = true,
}: VerseItemProps): React.JSX.Element => {
  const { bookmark: enrichedBookmark, isLoading, error } = useBookmarkVerse(bookmark);
  const ayahNumber = enrichedBookmark.verseKey?.split(':')[1];
  const baseWrapperClassName = cn(
    'flex w-full items-center justify-between gap-3 py-3 px-4 transition-colors min-h-[60px]',
    onSelect && 'hover:bg-surface-hover cursor-pointer'
  );

  return (
    <LoadingError
      isLoading={isLoading || !enrichedBookmark.verseKey || !enrichedBookmark.surahName}
      error={error}
      loadingFallback={
        <div className="px-4 py-3">
          <div className="animate-pulse flex items-center justify-between gap-4">
            <div className="h-4 bg-surface-hover rounded w-28"></div>
            <div className="h-3 bg-surface-hover rounded w-16"></div>
          </div>
          {showDivider ? <div className="mx-4 mt-2 h-px bg-border" /> : null}
        </div>
      }
      errorFallback={
        <div className="px-4 py-3">
          <p className="text-center text-error text-sm">Failed to load</p>
          {showDivider ? <div className="mx-4 mt-2 h-px bg-border" /> : null}
        </div>
      }
    >
      <>
        {onSelect ? (
          <button onClick={onSelect} type="button" className={baseWrapperClassName}>
            <span className="text-sm font-medium text-foreground truncate text-left">
              {enrichedBookmark.surahName}
            </span>
            <span className="text-xs text-muted shrink-0 text-right">Ayah {ayahNumber}</span>
          </button>
        ) : (
          <div className={baseWrapperClassName}>
            <span className="text-sm font-medium text-foreground truncate text-left">
              {enrichedBookmark.surahName}
            </span>
            <span className="text-xs text-muted shrink-0 text-right">Ayah {ayahNumber}</span>
          </div>
        )}
        {showDivider ? <div className="mx-4 h-px bg-border" /> : null}
      </>
    </LoadingError>
  );
};
