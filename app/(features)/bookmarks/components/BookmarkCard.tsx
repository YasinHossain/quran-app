'use client';

import { useRouter } from 'next/navigation';
import React, { memo, useCallback } from 'react';

import { useBookmarkAudio } from '@/app/(features)/bookmarks/hooks/useBookmarkAudio';
import { useBookmarkVerse } from '@/app/(features)/bookmarks/hooks/useBookmarkVerse';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { LoadingError } from '@/app/shared/LoadingError';
import { ContentBookmarkCard } from '@/app/shared/ui/cards/ContentBookmarkCard';
import { Bookmark } from '@/types';

import { ErrorFallback, LoadingFallback } from './shared/BookmarkCardComponents';

interface BookmarkCardProps {
  bookmark: Bookmark;
  folderId: string;
  onRemove?: () => void;
}

const useBookmarkHandlers = (
  enrichedBookmark: Bookmark,
  folderId: string,
  onRemove?: () => void
): {
  handleRemoveBookmark: () => void;
  handleNavigateToVerse: () => void;
  isVerseBookmarked: boolean;
} => {
  const { removeBookmark, isBookmarked } = useBookmarks();
  const router = useRouter();

  const handleRemoveBookmark = useCallback((): void => {
    removeBookmark(enrichedBookmark.verseId, folderId);
    onRemove?.();
  }, [removeBookmark, enrichedBookmark.verseId, folderId, onRemove]);

  const handleNavigateToVerse = useCallback((): void => {
    if (!enrichedBookmark.verseKey) return;
    const [surahId] = enrichedBookmark.verseKey.split(':');
    router.push(`/surah/${surahId}#verse-${enrichedBookmark.verseId}`);
  }, [enrichedBookmark.verseKey, enrichedBookmark.verseId, router]);

  const isVerseBookmarked = isBookmarked(enrichedBookmark.verseId);

  return { handleRemoveBookmark, handleNavigateToVerse, isVerseBookmarked };
};

const useBookmarkCardState = (
  enrichedBookmark: Bookmark,
  isLoading: boolean
): { isDataLoading: boolean } => {
  const isDataLoading =
    isLoading ||
    !enrichedBookmark.verseText ||
    !enrichedBookmark.translation ||
    !enrichedBookmark.verseKey ||
    !enrichedBookmark.surahName ||
    !enrichedBookmark.verseApiId;

  return { isDataLoading };
};

export const BookmarkCard = memo(function BookmarkCard({
  bookmark,
  folderId,
  onRemove,
}: BookmarkCardProps): React.JSX.Element {
  const { settings } = useSettings();
  const { chapters } = useBookmarks();
  const { bookmark: enrichedBookmark, isLoading, error } = useBookmarkVerse(bookmark, chapters);

  const { handlePlayPause, isPlaying, isLoadingAudio } = useBookmarkAudio(
    enrichedBookmark,
    enrichedBookmark.verseApiId
  );

  const { handleRemoveBookmark, handleNavigateToVerse, isVerseBookmarked } = useBookmarkHandlers(
    enrichedBookmark,
    folderId,
    onRemove
  );

  const { isDataLoading } = useBookmarkCardState(enrichedBookmark, isLoading);

  return (
    <LoadingError
      isLoading={isDataLoading}
      error={error}
      loadingFallback={<LoadingFallback />}
      errorFallback={<ErrorFallback error={error} verseId={bookmark.verseId} />}
    >
      <ContentBookmarkCard
        bookmark={enrichedBookmark}
        isPlaying={isPlaying}
        isLoadingAudio={isLoadingAudio}
        onPlayPause={handlePlayPause}
        isBookmarked={isVerseBookmarked}
        onBookmark={handleRemoveBookmark}
        onNavigateToVerse={handleNavigateToVerse}
        settings={{
          arabicFontFace: settings.arabicFontFace,
          arabicFontSize: settings.arabicFontSize,
          tajweed: settings.tajweed,
        }}
      />
    </LoadingError>
  );
});
