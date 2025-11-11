'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { useBookmarkVerse } from '@/app/(features)/bookmarks/hooks/useBookmarkVerse';
import { useVerseCard } from '@/app/(features)/surah/components/verse-card/useVerseCard';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { ReaderVerseCard } from '@/app/shared/reader';
import { Spinner } from '@/app/shared/Spinner';
import { parseVerseKey } from '@/lib/utils/verse';
import type { Bookmark, Verse } from '@/types';

export const PinnedVerseListItem = ({ bookmark }: { bookmark: Bookmark }): React.JSX.Element => {
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
  const { verseRef, actions } = usePinnedVerseActions(verse, bookmark);
  const isVisible = useMountVisible();

  return (
    <div
      className={`transform transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      <ReaderVerseCard ref={verseRef} verse={verse} actions={actions} />
    </div>
  );
};

function usePinnedVerseActions(
  verse: Verse,
  bookmark: Bookmark
): {
  verseRef: React.RefObject<HTMLDivElement | null>;
  actions: {
    verseKey: string;
    verseId: string;
    isPlaying: boolean;
    isLoadingAudio: boolean;
    isBookmarked: boolean;
    onPlayPause: () => void;
    onBookmark: () => void;
    onNavigateToVerse: () => void;
    showRemove: boolean;
  };
} {
  const router = useRouter();
  const { togglePinned, isPinned } = useBookmarks();
  const verseCard = useVerseCard(verse);
  const { verseRef, isPlaying, isLoadingAudio, isVerseBookmarked, handlePlayPause } = verseCard;

  const handleNavigateToVerse = React.useCallback(() => {
    const verseKey = bookmark.verseKey ?? verse.verse_key;
    if (!verseKey) return;
    const { surahNumber, ayahNumber } = parseVerseKey(verseKey);
    if (!surahNumber || !ayahNumber) return;
    const params = new URLSearchParams({ startVerse: String(ayahNumber) });
    router.push(`/surah/${surahNumber}?${params.toString()}`);
  }, [bookmark.verseKey, router, verse.verse_key]);

  const handleTogglePinned = React.useCallback(() => {
    togglePinned(bookmark.verseId, { verseKey: bookmark.verseKey ?? verse.verse_key });
  }, [bookmark.verseId, bookmark.verseKey, togglePinned, verse.verse_key]);

  return {
    verseRef,
    actions: {
      verseKey: bookmark.verseKey ?? verse.verse_key,
      verseId: String(bookmark.verseId),
      isPlaying,
      isLoadingAudio,
      isBookmarked: isVerseBookmarked,
      onPlayPause: handlePlayPause,
      onBookmark: handleTogglePinned,
      onNavigateToVerse: handleNavigateToVerse,
      showRemove: isPinned(bookmark.verseId),
    },
  };
}
function useMountVisible(): boolean {
  const [isVisible, setIsVisible] = React.useState(false);
  React.useEffect(() => setIsVisible(true), []);
  return isVisible;
}
