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
    'w-full text-left py-2.5 px-4 transition-colors',
    onSelect && 'hover:bg-surface-hover cursor-pointer'
  );

  return (
    <LoadingError
      isLoading={isLoading || !enrichedBookmark.verseKey || !enrichedBookmark.surahName}
      error={error}
      loadingFallback={
        <div className="px-4 py-2.5">
          <div className="animate-pulse space-y-1.5">
            <div className="h-4 bg-surface-hover rounded w-16"></div>
            <div className="h-3 bg-surface-hover rounded w-24"></div>
          </div>
          {showDivider ? <div className="mx-4 mt-2 h-px bg-border" /> : null}
        </div>
      }
      errorFallback={
        <div className="px-4 py-2.5">
          <p className="text-center text-error text-sm">Failed to load</p>
          {showDivider ? <div className="mx-4 mt-2 h-px bg-border" /> : null}
        </div>
      }
    >
      <>
        {onSelect ? (
          <button onClick={onSelect} type="button" className={baseWrapperClassName}>
            <div className="flex flex-col gap-px">
              <p className="text-sm font-medium text-foreground truncate leading-[1.05]">
                {enrichedBookmark.surahName}
              </p>
              <p className="text-xs text-muted truncate leading-[1.15] -mt-0.5">
                Ayah {ayahNumber}
              </p>
            </div>
          </button>
        ) : (
          <div className={baseWrapperClassName}>
            <div className="flex flex-col gap-px">
              <p className="text-sm font-medium text-foreground truncate leading-[1.05]">
                {enrichedBookmark.surahName}
              </p>
              <p className="text-xs text-muted truncate leading-[1.15] -mt-0.5">
                Ayah {ayahNumber}
              </p>
            </div>
          </div>
        )}
        {showDivider ? <div className="mx-4 h-px bg-border" /> : null}
      </>
    </LoadingError>
  );
};
