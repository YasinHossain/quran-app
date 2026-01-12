'use client';

import React from 'react';

import { useBookmarkVerse } from '@/app/(features)/bookmarks/hooks/useBookmarkVerse';
import { CloseIcon } from '@/app/shared/icons';
import { LoadingError } from '@/app/shared/LoadingError';
import { Bookmark, Verse } from '@/types';

interface ExpandedContentProps {
  isExpanded: boolean;
  folderBookmarks: Bookmark[];
  onRemoveBookmark?: (bookmark: Bookmark) => void;
}

export const ExpandedContent = ({
  isExpanded,
  folderBookmarks,
  onRemoveBookmark,
}: ExpandedContentProps): React.JSX.Element | null => {
  const [shouldRender, setShouldRender] = React.useState(isExpanded);

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isExpanded) {
      setShouldRender(true);
    } else {
      timeoutId = setTimeout(() => {
        setShouldRender(false);
      }, 500);
    }
    return () => clearTimeout(timeoutId);
  }, [isExpanded]);

  return (
    <div
      className={`grid w-full transition-[grid-template-rows] duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
    >
      <div className="overflow-hidden">
        {shouldRender && (
          <div className="w-full border-t border-border/30 dark:border-border/20 bg-surface-navigation text-foreground rounded-b-xl">
            {folderBookmarks.length > 0 ? (
              folderBookmarks.map((bookmark, index) => (
                <FolderVerseItem
                  key={String(bookmark.verseId)}
                  bookmark={bookmark}
                  showDivider={index < folderBookmarks.length - 1}
                  {...(onRemoveBookmark ? { onRemoveBookmark } : {})}
                />
              ))
            ) : (
              <p className="px-4 py-4 text-sm text-center text-muted">This folder is empty.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const FolderVerseItem = ({
  bookmark,
  onSelect,
  showDivider = true,
  onRemoveBookmark,
}: {
  bookmark: Bookmark;
  onSelect?: (() => void) | undefined;
  showDivider?: boolean;
  onRemoveBookmark?: (bookmark: Bookmark) => void;
}): React.JSX.Element => {
  const { bookmark: enrichedBookmark, verse, isLoading, error } = useBookmarkVerse(bookmark);

  return (
    <LoadingError
      isLoading={isLoading || !enrichedBookmark.verseKey || !enrichedBookmark.surahName || !verse}
      error={error}
      loadingFallback={<SidebarVerseItemSkeleton withDivider={showDivider} />}
      errorFallback={<SidebarVerseItemError withDivider={showDivider} />}
    >
      {verse ? (
        <LoadedFolderVerseItem
          verse={verse}
          bookmark={enrichedBookmark}
          onRemoveBookmark={onRemoveBookmark}
          showDivider={showDivider}
        />
      ) : null}
    </LoadingError>
  );
};

const LoadedFolderVerseItem = ({
  verse,
  bookmark,
  onRemoveBookmark,
  showDivider,
}: {
  verse: Verse;
  bookmark: Bookmark;
  onRemoveBookmark: ((bookmark: Bookmark) => void) | undefined;
  showDivider: boolean;
}): React.JSX.Element => {
  const handleRemove = React.useCallback(() => {
    onRemoveBookmark?.(bookmark);
  }, [onRemoveBookmark, bookmark]);

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 group hover:bg-surface-secondary/50 transition-colors">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">{bookmark.surahName}</span>
          <span className="text-xs text-muted-foreground">
            Verse {bookmark.verseKey?.split(':')[1]}
          </span>
        </div>
        <button
          onClick={handleRemove}
          className="p-1.5 rounded-full text-muted-foreground hover:bg-interactive-hover hover:text-error transition-colors"
          aria-label="Remove bookmark"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
      {showDivider ? <div className="mx-4 h-px bg-border" /> : null}
    </>
  );
};

const SidebarVerseItemSkeleton = ({ withDivider }: { withDivider: boolean }): React.JSX.Element => (
  <div className="px-4 py-3">
    <div className="animate-pulse flex items-center justify-between gap-4">
      <div className="h-4 bg-interactive/70 rounded w-28"></div>
      <div className="h-3 bg-interactive/70 rounded w-16"></div>
    </div>
    {withDivider ? <div className="mx-4 mt-2 h-px bg-border" /> : null}
  </div>
);

const SidebarVerseItemError = ({ withDivider }: { withDivider: boolean }): React.JSX.Element => (
  <div className="px-4 py-3">
    <p className="text-center text-error text-sm">Failed to load</p>
    {withDivider ? <div className="mx-4 mt-2 h-px bg-border" /> : null}
  </div>
);
