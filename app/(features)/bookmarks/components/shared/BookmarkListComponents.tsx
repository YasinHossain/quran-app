'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { FixedSizeList as List } from 'react-window';

import { BookmarkCard } from '@/app/(features)/bookmarks/components/BookmarkCard';
import { ArrowLeftIcon, BookmarkIcon } from '@/app/shared/icons';
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

export const EmptyBookmarkState = ({ onBack }: EmptyBookmarkStateProps): React.JSX.Element => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`text-center py-16 transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
        <BookmarkIcon size={32} className="text-muted" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        {t('bookmarks_empty_no_bookmarks_title')}
      </h3>
      <p className="mx-auto mb-4 max-w-md text-muted">{t('bookmarks_empty_state_description')}</p>
      {onBack && (
        <button
          onClick={onBack}
          className="rounded-lg bg-accent px-4 py-2 text-on-accent transition-colors hover:bg-accent/90"
        >
          {t('bookmarks_back_to_folders')}
        </button>
      )}
    </div>
  );
};

export const SimpleEmptyState = (): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-16">
      <div className="max-w-sm mx-auto">
        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
          <BookmarkIcon size={32} className="text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {t('bookmarks_empty_no_bookmarks_title')}
        </h3>
        <p className="text-muted mb-4">{t('bookmarks_empty_state_secondary')}</p>
      </div>
    </div>
  );
};

export const BookmarkListHeader = ({
  folder,
  bookmarkCount,
  onBack,
}: BookmarkListHeaderProps): React.JSX.Element | null => {
  const { t } = useTranslation();
  if (!onBack) return null;
  const backLabel = t('bookmarks_back_to_folders');
  const backAriaLabel = t('bookmarks_back_to_folders_aria');
  const bookmarkCountLabel =
    bookmarkCount === 1
      ? t('bookmarks_bookmark_count_single', { count: bookmarkCount })
      : t('bookmarks_bookmark_count_plural', { count: bookmarkCount });

  return (
    <div className="mb-8 flex items-center gap-4">
      <button
        onClick={onBack}
        className="rounded-full p-2 text-muted hover:bg-surface-hover hover:text-accent transition-colors"
        aria-label={backAriaLabel}
      >
        <ArrowLeftIcon size={20} />
      </button>
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-foreground mb-1">{folder.name}</h1>
        <p className="text-muted">{bookmarkCountLabel}</p>
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
