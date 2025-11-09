'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';

import { useBookmarkVerse } from '@/app/(features)/bookmarks/hooks/useBookmarkVerse';
import { useVerseCard } from '@/app/(features)/surah/components/verse-card/useVerseCard';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { ReaderVerseCard } from '@/app/shared/reader';
import { Spinner } from '@/app/shared/Spinner';

import type { Bookmark, Verse } from '@/types';

interface BookmarkVerseListProps {
  bookmarks: Bookmark[];
}

const WORKSPACE_SCROLL_SELECTOR =
  '[data-slot="bookmarks-landing-main"], [data-slot="workspace-main"], [data-slot="bookmarks-workspace-main"]';

export const BookmarkVerseList = ({ bookmarks }: BookmarkVerseListProps): React.JSX.Element => {
  const hasBookmarks = bookmarks.length > 0;
  const [scrollElement, setScrollElement] = React.useState<HTMLElement | null>(null);

  const setRootRef = React.useCallback((node: HTMLDivElement | null) => {
    if (!node) {
      setScrollElement(null);
      return;
    }
    const workspaceScroll = node.closest<HTMLElement>(WORKSPACE_SCROLL_SELECTOR);
    if (workspaceScroll) {
      setScrollElement(workspaceScroll);
    }
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: bookmarks.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => 360,
    overscan: 6,
    getItemKey: (index) => {
      const bookmark = bookmarks[index];
      if (!bookmark) return index;
      return `bookmark-${bookmark.verseId}-${bookmark.verseKey ?? index}`;
    },
  });

  if (!hasBookmarks) {
    return <div className="text-center py-20 text-muted">No verses in this folder</div>;
  }

  return (
    <div className="w-full relative" ref={setRootRef}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const bookmark = bookmarks[virtualItem.index];
          if (!bookmark) return null;

          return (
            <div
              key={virtualItem.key}
              ref={rowVirtualizer.measureElement}
              data-index={virtualItem.index}
              className="absolute left-0 top-0 w-full"
              style={{ transform: `translateY(${virtualItem.start}px)` }}
            >
              <BookmarkVerseListItem bookmark={bookmark} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BookmarkVerseListItem = ({ bookmark }: { bookmark: Bookmark }): React.JSX.Element => {
  const { bookmark: enrichedBookmark, verse, isLoading, error } = useBookmarkVerse(bookmark);

  if (error) {
    return (
      <div className="text-center py-6 text-status-error bg-status-error/10 p-4 rounded-lg">
        Failed to load verse {bookmark.verseId}. {error}
      </div>
    );
  }

  if (isLoading || !verse || !enrichedBookmark.verseKey) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-6 w-6 text-accent" />
      </div>
    );
  }

  return <LoadedBookmarkVerseItem verse={verse} bookmark={enrichedBookmark} />;
};

const LoadedBookmarkVerseItem = ({
  verse,
  bookmark,
}: {
  verse: Verse;
  bookmark: Bookmark;
}): React.JSX.Element => {
  const { removeBookmark, findBookmark } = useBookmarks();
  const { verseRef, isPlaying, isLoadingAudio, isVerseBookmarked, handlePlayPause } =
    useVerseCard(verse);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRemoveBookmark = React.useCallback(() => {
    const bookmarkInfo = findBookmark(bookmark.verseId);
    if (!bookmarkInfo) return;
    removeBookmark(bookmark.verseId, bookmarkInfo.folder.id);
  }, [bookmark.verseId, findBookmark, removeBookmark]);

  return (
    <div
      className={`transform transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      <ReaderVerseCard
        ref={verseRef}
        verse={verse}
        actions={{
          verseKey: bookmark.verseKey ?? verse.verse_key,
          verseId: bookmark.verseId,
          isPlaying,
          isLoadingAudio,
          isBookmarked: isVerseBookmarked,
          onPlayPause: handlePlayPause,
          onBookmark: handleRemoveBookmark,
          showRemove: true,
        }}
      />
    </div>
  );
};
