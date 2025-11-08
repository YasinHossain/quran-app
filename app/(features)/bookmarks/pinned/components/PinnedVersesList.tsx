'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';

import { useBookmarkVerse } from '@/app/(features)/bookmarks/hooks/useBookmarkVerse';
import { useVerseCard } from '@/app/(features)/surah/components/verse-card/useVerseCard';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { ReaderVerseCard } from '@/app/shared/reader';
import { Spinner } from '@/app/shared/Spinner';

import type { Bookmark, Verse } from '@/types';

interface PinnedVersesListProps {
  bookmarks: Bookmark[];
  isLoading: boolean;
}

const WORKSPACE_SCROLL_SELECTOR = '[data-slot="bookmarks-landing-main"], [data-slot="workspace-main"]';

export const PinnedVersesList = ({
  bookmarks,
  isLoading,
}: PinnedVersesListProps): React.JSX.Element => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

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
      return `pinned-${bookmark.verseId}-${bookmark.verseKey ?? index}`;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8 text-accent" />
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Pinned Verses</h3>
        <p className="text-muted max-w-md mx-auto">
          Pin your favorite verses while reading to access them quickly from here.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`w-full transition-opacity duration-300 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div ref={setRootRef} className="relative w-full">
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
                <PinnedVerseListItem bookmark={bookmark} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const PinnedVerseListItem = ({ bookmark }: { bookmark: Bookmark }): React.JSX.Element => {
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

  return <LoadedPinnedVerseItem verse={verse} bookmark={enrichedBookmark} />;
};

const LoadedPinnedVerseItem = ({
  verse,
  bookmark,
}: {
  verse: Verse;
  bookmark: Bookmark;
}): React.JSX.Element => {
  const router = useRouter();
  const { togglePinned, isPinned } = useBookmarks();
  const { verseRef, isPlaying, isLoadingAudio, isVerseBookmarked, handlePlayPause } =
    useVerseCard(verse);

  const handleNavigateToVerse = React.useCallback(() => {
    const verseKey = bookmark.verseKey ?? verse.verse_key;
    if (!verseKey) return;
    const [surahId] = verseKey.split(':');
    if (!surahId) return;
    router.push(`/surah/${surahId}#verse-${bookmark.verseId}`);
  }, [bookmark.verseId, bookmark.verseKey, router, verse.verse_key]);

  const handleTogglePinned = React.useCallback(() => {
    togglePinned(bookmark.verseId, { verseKey: bookmark.verseKey ?? verse.verse_key });
  }, [bookmark.verseId, bookmark.verseKey, togglePinned, verse.verse_key]);

  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

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
          onBookmark: handleTogglePinned,
          onNavigateToVerse: handleNavigateToVerse,
          showRemove: isPinned(bookmark.verseId),
        }}
      />
    </div>
  );
};
