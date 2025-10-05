'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { FixedSizeList as List } from 'react-window';

import { BookmarkCard } from '@/app/(features)/bookmarks/components/BookmarkCard';
import { ArrowLeftIcon } from '@/app/shared/icons';
import { Bookmark, Folder } from '@/types';

interface EmptyBookmarkStateProps {
  onBack?: (() => void) | undefined;
}

interface BookmarkListHeaderProps {
  folder: Folder;
  bookmarkCount: number;
  onBack?: (() => void) | undefined;
}

interface BookmarkListContentProps {
  bookmarks: Bookmark[];
  folder: Folder;
  listHeight: number;
  itemSize: number;
  onRemoveBookmark: (verseId: string) => void;
}

const BookmarkIcon = (): React.JSX.Element => (
  <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
    />
  </svg>
);

export const EmptyBookmarkState = ({ onBack }: EmptyBookmarkStateProps): React.JSX.Element => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
    <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
      <BookmarkIcon />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">No Bookmarks</h3>
    <p className="text-muted max-w-md mx-auto mb-4">
      This folder is empty. Start bookmarking verses while reading to add them here.
    </p>
    {onBack && (
      <button
        onClick={onBack}
        className="px-4 py-2 bg-accent text-on-accent rounded-lg hover:bg-accent/90 transition-colors"
      >
        Back to Folders
      </button>
    )}
  </motion.div>
);

export const SimpleEmptyState = (): React.JSX.Element => (
  <div className="text-center py-16">
    <div className="max-w-sm mx-auto">
      <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
        <BookmarkIcon />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No Bookmarks</h3>
      <p className="text-muted mb-4">
        This folder is empty. Add some bookmarked verses to see them here.
      </p>
    </div>
  </div>
);

export const BookmarkListHeader = ({
  folder,
  bookmarkCount,
  onBack,
}: BookmarkListHeaderProps): React.JSX.Element | null => {
  if (!onBack) return null;

  return (
    <div className="mb-8 flex items-center gap-4">
      <button
        onClick={onBack}
        className="rounded-full p-2 text-muted hover:bg-surface-hover hover:text-accent transition-colors"
        aria-label="Go back to folders"
      >
        <ArrowLeftIcon size={20} />
      </button>
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-foreground mb-1">{folder.name}</h1>
        <p className="text-muted">
          {bookmarkCount} {bookmarkCount === 1 ? 'verse' : 'verses'} bookmarked
        </p>
      </div>
    </div>
  );
};

export const BookmarkListContent = ({
  bookmarks,
  folder,
  listHeight,
  itemSize,
  onRemoveBookmark,
}: BookmarkListContentProps): React.JSX.Element => (
  <List height={listHeight} width="100%" itemCount={bookmarks.length} itemSize={itemSize}>
    {({ index, style }) => {
      const bookmark = bookmarks[index];
      if (!bookmark) return null;
      return (
        <div style={style} className="px-0">
          <BookmarkCard
            bookmark={bookmark}
            folderId={folder.id}
            onRemove={() => onRemoveBookmark(bookmark.verseId)}
          />
        </div>
      );
    }}
  </List>
);
