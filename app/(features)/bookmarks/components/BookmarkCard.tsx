'use client';

import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bookmark } from '@/types';
import { useAudio } from '@/app/shared/player/context/AudioContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import ResponsiveVerseActions from '@/app/shared/ResponsiveVerseActions';
import VerseArabic from '@/app/shared/VerseArabic';
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
  const { removeBookmark, isBookmarked } = useBookmarks();

  // Use the hook to fetch verse data
  const { bookmarkWithVerse, isLoading, error } = useBookmarkVerse(
    bookmark.verseId,
    bookmark.createdAt
  );

  const handlePlayPause = useCallback(() => {
    if (playingId === bookmarkWithVerse.verse?.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      setLoadingId(null);
      setActiveVerse(null);
      setIsPlaying(false);
    } else if (bookmarkWithVerse.verse) {
      // Convert our bookmark verse format to the expected Verse type
      const verseForAudio = {
        ...bookmarkWithVerse.verse,
        id: bookmarkWithVerse.verse.id,
        verse_key: bookmarkWithVerse.verse.verse_key,
        text_uthmani: bookmarkWithVerse.verse.text_uthmani,
        translations: bookmarkWithVerse.verse.translations || [],
      };
      setActiveVerse(verseForAudio);
      setPlayingId(bookmarkWithVerse.verse.id);
      setLoadingId(bookmarkWithVerse.verse.id);
      setIsPlaying(true);
      openPlayer();
    }
  }, [
    playingId,
    bookmarkWithVerse.verse,
    audioRef,
    setActiveVerse,
    setPlayingId,
    setLoadingId,
    setIsPlaying,
    openPlayer,
  ]);

  const handleRemoveBookmark = useCallback(() => {
    removeBookmark(bookmarkWithVerse.verseId, folderId);
    onRemove?.();
  }, [removeBookmark, bookmarkWithVerse.verseId, folderId, onRemove]);

  const handleNavigateToVerse = useCallback(() => {
    if (!bookmarkWithVerse.verse) return;
    // Use Next.js router instead of window.location for better performance
    const surahId = bookmarkWithVerse.verse.surahId;
    const verseId = bookmarkWithVerse.verse.id;
    window.location.href = `/surah/${surahId}#verse-${verseId}`;
  }, [bookmarkWithVerse.verse]);

  // If we don't have verse data yet or it's loading, show a loading state
  if (isLoading || !bookmarkWithVerse.verse) {
    return (
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
    );
  }

  // Show error state if verse failed to load
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-surface border border-border p-6 mb-6 border-red-200"
      >
        <div className="text-red-600 text-center">
          <p>Failed to load verse: {error}</p>
          <p className="text-sm text-muted mt-2">Verse ID: {bookmark.verseId}</p>
        </div>
      </motion.div>
    );
  }

  const verse = bookmarkWithVerse.verse!;
  const isPlaying = playingId === verse.id;
  const isLoadingAudio = loadingId === verse.id;
  const isVerseBookmarked = isBookmarked(String(verse.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-surface border border-border p-6 mb-6 hover:border-accent/30 transition-colors"
    >
      {/* Header with surah info and timestamp */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-accent font-semibold text-sm">{verse.verse_key}</span>
          <span className="text-muted text-sm">{verse.surahNameEnglish}</span>
        </div>
        <span className="text-xs text-muted">{formatTimeAgo(bookmarkWithVerse.createdAt)}</span>
      </div>

      {/* Main content similar to verse page */}
      <div className="space-y-4 md:space-y-0 md:flex md:items-start md:gap-x-6">
        {/* Verse actions */}
        <ResponsiveVerseActions
          verseKey={verse.verse_key}
          isPlaying={isPlaying}
          isLoadingAudio={isLoadingAudio}
          isBookmarked={isVerseBookmarked}
          onPlayPause={handlePlayPause}
          onBookmark={handleRemoveBookmark}
          onNavigateToVerse={handleNavigateToVerse}
          showRemove={true}
          className="md:w-16 md:pt-1"
        />

        {/* Verse content */}
        <div className="space-y-6 md:flex-grow">
          <VerseArabic
            verse={{
              ...verse,
              id: verse.id,
              verse_key: verse.verse_key,
              text_uthmani: verse.text_uthmani,
            }}
          />

          {/* Translations */}
          {verse.translations?.map((translation) => (
            <div key={translation.resource_id}>
              <p
                className="text-left leading-relaxed text-foreground"
                style={{ fontSize: `${settings.translationFontSize}px` }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(translation.text) }}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
});
