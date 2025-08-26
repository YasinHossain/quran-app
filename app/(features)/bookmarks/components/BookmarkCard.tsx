'use client';

import React, { memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark } from '@/types';
import { useAudio } from '@/app/shared/player/context/AudioContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { ContentBookmarkCard } from '@/app/shared/ui/cards/ContentBookmarkCard';
import LoadingError from '@/app/shared/LoadingError';
import { motion } from 'framer-motion';
// Simple time ago function
const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years === 1 ? '' : 's'} ago`;
  if (months > 0) return `${months} month${months === 1 ? '' : 's'} ago`;
  if (weeks > 0) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  return 'Just now';
};
import { useBookmarkVerse } from '../hooks/useBookmarkVerse';

interface BookmarkCardProps {
  bookmark: Bookmark;
  folderId: string;
  onRemove?: () => void;
}

export const BookmarkCard = memo(function BookmarkCard({
  bookmark,
  folderId,
  onRemove,
}: BookmarkCardProps) {
  const {
    playingId,
    setPlayingId,
    loadingId,
    setLoadingId,
    setActiveVerse,
    audioRef,
    setIsPlaying,
    openPlayer,
  } = useAudio();
  const { settings } = useSettings();
  const { removeBookmark, isBookmarked, chapters } = useBookmarks();

  const { bookmark: enrichedBookmark, isLoading, error } = useBookmarkVerse(bookmark, chapters);

  const router = useRouter();

  const verseApiId = enrichedBookmark.verseApiId;

  const handlePlayPause = useCallback(() => {
    if (!verseApiId) return;
    if (playingId === verseApiId) {
      audioRef.current?.pause();
      setPlayingId(null);
      setLoadingId(null);
      setActiveVerse(null);
      setIsPlaying(false);
    } else if (enrichedBookmark.verseKey && enrichedBookmark.verseText) {
      const verseForAudio = {
        id: verseApiId,
        verse_key: enrichedBookmark.verseKey,
        text_uthmani: enrichedBookmark.verseText,
        translations: enrichedBookmark.translation
          ? [
              {
                id: 0,
                resource_id: 0,
                text: enrichedBookmark.translation,
              },
            ]
          : [],
      };
      setActiveVerse(verseForAudio);
      setPlayingId(verseApiId);
      setLoadingId(verseApiId);
      setIsPlaying(true);
      openPlayer();
    }
  }, [
    verseApiId,
    playingId,
    enrichedBookmark.verseKey,
    enrichedBookmark.verseText,
    enrichedBookmark.translation,
    audioRef,
    setActiveVerse,
    setPlayingId,
    setLoadingId,
    setIsPlaying,
    openPlayer,
  ]);

  const handleRemoveBookmark = useCallback(() => {
    removeBookmark(enrichedBookmark.verseId, folderId);
    onRemove?.();
  }, [removeBookmark, enrichedBookmark.verseId, folderId, onRemove]);

  const handleNavigateToVerse = useCallback(() => {
    if (!enrichedBookmark.verseKey) return;
    const [surahId] = enrichedBookmark.verseKey.split(':');
    router.push(`/surah/${surahId}#verse-${enrichedBookmark.verseId}`);
  }, [enrichedBookmark.verseKey, enrichedBookmark.verseId, router]);

  const isPlaying = playingId === verseApiId;
  const isLoadingAudio = loadingId === verseApiId;
  const isVerseBookmarked = isBookmarked(enrichedBookmark.verseId);

  return (
    <LoadingError
      isLoading={
        isLoading ||
        !enrichedBookmark.verseText ||
        !enrichedBookmark.translation ||
        !enrichedBookmark.verseKey ||
        !enrichedBookmark.surahName ||
        !enrichedBookmark.verseApiId
      }
      error={error}
      loadingFallback={
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-surface border border-border p-6 mb-6"
        >
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-surface-hover rounded w-32"></div>
              <div className="h-3 bg-surface-hover rounded w-20"></div>
            </div>
            <div className="space-y-3">
              <div className="h-6 bg-surface-hover rounded"></div>
              <div className="h-4 bg-surface-hover rounded w-3/4"></div>
            </div>
          </div>
        </motion.div>
      }
      errorFallback={
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-surface border border-border p-6 mb-6 border-red-200"
        >
          <div className="text-red-600 text-center">
            <p>Failed to load verse: {String(error)}</p>
            <p className="text-sm text-muted mt-2">Verse ID: {bookmark.verseId}</p>
          </div>
        </motion.div>
      }
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
