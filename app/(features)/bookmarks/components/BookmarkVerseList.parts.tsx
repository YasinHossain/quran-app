'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { useVerseCard } from '@/app/(features)/surah/components/verse-card/useVerseCard';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { parseVerseKey } from '@/lib/utils/verse';

import type { Bookmark, Verse } from '@/types';

export const EmptyBookmarks = (): React.JSX.Element => (
  <div className="text-center py-20 text-muted">No verses in this folder</div>
);

export function useBookmarkVerseActions(
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
    showRemove: true;
  };
} {
  const router = useRouter();
  const { removeBookmark, findBookmark } = useBookmarks();
  const card = useVerseCard(verse);

  const handleRemoveBookmark = React.useCallback(() => {
    const info = findBookmark(bookmark.verseId);
    if (info) removeBookmark(bookmark.verseId, info.folder.id);
  }, [bookmark.verseId, findBookmark, removeBookmark]);

  const handleNavigateToVerse = React.useCallback(() => {
    const { surahNumber, ayahNumber } = parseVerseKey(bookmark.verseKey ?? verse.verse_key);
    if (surahNumber && ayahNumber) {
      router.push(buildSurahRoute(surahNumber, ayahNumber));
    }
  }, [bookmark.verseKey, router, verse.verse_key]);

  return {
    verseRef: card.verseRef,
    actions: {
      verseKey: bookmark.verseKey ?? verse.verse_key,
      verseId: String(bookmark.verseId),
      isPlaying: card.isPlaying,
      isLoadingAudio: card.isLoadingAudio,
      isBookmarked: card.isVerseBookmarked,
      onPlayPause: card.handlePlayPause,
      onBookmark: handleRemoveBookmark,
      onNavigateToVerse: handleNavigateToVerse,
      showRemove: true as const,
    },
  };
}

function buildSurahRoute(surahNumber: number, ayahNumber: number): string {
  const qs = new URLSearchParams({ startVerse: String(ayahNumber) });
  return `/surah/${surahNumber}?${qs.toString()}`;
}

export function useMountVisible(): boolean {
  const [isVisible, setIsVisible] = React.useState(false);
  React.useEffect(() => setIsVisible(true), []);
  return isVisible;
}

export const AnimatedMount = ({
  isVisible,
  children,
}: {
  isVisible: boolean;
  children: React.ReactNode;
}): React.JSX.Element => (
  <div
    className={`transform transition-all duration-300 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
    }`}
  >
    {children}
  </div>
);
