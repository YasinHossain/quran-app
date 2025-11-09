'use client';

import React from 'react';

import { useBookmarkVerse } from '@/app/(features)/bookmarks/hooks/useBookmarkVerse';
import { CloseIcon } from '@/app/shared/icons';
import { LoadingError } from '@/app/shared/LoadingError';
import { cn } from '@/lib/utils/cn';
import { Bookmark } from '@/types';

interface VerseItemProps {
  bookmark: Bookmark;
  onSelect?: (() => void) | undefined;
  showDivider?: boolean;
  onRemoveBookmark?: (bookmark: Bookmark) => void;
}

export const VerseItem = ({
  bookmark,
  onSelect,
  showDivider = true,
  onRemoveBookmark,
}: VerseItemProps): React.JSX.Element => {
  const { bookmark: enrichedBookmark, isLoading, error } = useBookmarkVerse(bookmark);
  const ayahNumber = enrichedBookmark.verseKey?.split(':')[1];
  const surahName = enrichedBookmark.surahName ?? 'bookmark';
  const verseLabel = ayahNumber ? `Verse ${ayahNumber}` : 'Verse';
  const baseWrapperClassName = cn(
    'flex w-full items-center justify-between gap-3 py-3 px-4 transition-colors min-h-[60px]',
    onSelect && 'hover:bg-surface-hover cursor-pointer'
  );
  const interactiveProps = onSelect
    ? {
        role: 'button' as const,
        tabIndex: 0,
        onClick: onSelect,
        onKeyDown: (event: React.KeyboardEvent) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect();
          }
        },
      }
    : {};
  const removeButton =
    typeof onRemoveBookmark === 'function' ? (
      <button
        type="button"
        aria-label={`Remove ${surahName} bookmark`}
        className="ml-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-muted transition-colors duration-200 hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
        onClick={(event): void => {
          event.stopPropagation();
          onRemoveBookmark(bookmark);
        }}
      >
        <CloseIcon size={16} strokeWidth={2.2} />
      </button>
    ) : null;

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
        <div className={baseWrapperClassName} {...interactiveProps}>
          <div className="flex flex-col min-w-0 text-left">
            <span className="text-sm font-semibold text-foreground truncate">{surahName}</span>
            <span className="text-xs text-muted mt-1">{verseLabel}</span>
          </div>
          {removeButton}
        </div>
        {showDivider ? <div className="mx-4 h-px bg-border" /> : null}
      </>
    </LoadingError>
  );
};
