'use client';

import React from 'react';

import { useBookmarkVerseActions } from '@/app/(features)/bookmarks/components/BookmarkVerseList.parts';
import { useBookmarkVerse } from '@/app/(features)/bookmarks/hooks/useBookmarkVerse';
import { ReaderVerseCard } from '@/app/shared/reader';
import { CloseIcon } from '@/app/shared/icons';
import { LoadingError } from '@/app/shared/LoadingError';
import { cn } from '@/lib/utils/cn';
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
  if (!isExpanded) return null;

  return (
    <div className="w-full border-t border-border/20 bg-surface-glass/80 text-foreground rounded-b-xl backdrop-blur-xl">
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
  const { verseRef, actions } = useBookmarkVerseActions(verse, bookmark);

  const handleRemove = React.useCallback(() => {
    onRemoveBookmark?.(bookmark);
  }, [onRemoveBookmark, bookmark]);

  const customActions = React.useMemo(
    () => ({
      ...actions,
      onBookmark: handleRemove,
      isBookmarked: true,
    }),
    [actions, handleRemove]
  );

  return (
    <>
      <div className="px-2 py-2">
        <ReaderVerseCard
          ref={verseRef}
          verse={verse}
          actions={customActions}
          className="border-none mb-0 pb-0 pt-0"
        />
      </div>
      {showDivider ? <div className="mx-4 h-px bg-border" /> : null}
    </>
  );
};

const SidebarVerseItemSkeleton = ({ withDivider }: { withDivider: boolean }): React.JSX.Element => (
  <div className="px-4 py-3">
    <div className="animate-pulse flex items-center justify-between gap-4">
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-28"></div>
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
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
