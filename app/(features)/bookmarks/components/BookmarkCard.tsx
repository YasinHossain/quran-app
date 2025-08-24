'use client';

import React, { memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Bookmark } from '@/types';
import { useAudio } from '@/app/shared/player/context/AudioContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { applyTajweed } from '@/lib/text/tajweed';
import ResponsiveVerseActions from '@/app/shared/ResponsiveVerseActions';
import LoadingError from '@/app/shared/LoadingError';
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-surface border border-border p-5 mb-4 hover:border-accent/30 hover:bg-surface-hover transition-all duration-200 cursor-pointer group hover:shadow-md hover:-translate-y-0.5"
        role="article"
        aria-label={`Bookmark for verse ${enrichedBookmark.verseKey} from ${enrichedBookmark.surahName}`}
        onClick={handleNavigateToVerse}
      >
        {/* Compact header layout */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-accent font-semibold text-sm">{enrichedBookmark.verseKey}</span>
            <span className="text-muted text-sm truncate">{enrichedBookmark.surahName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted">{formatTimeAgo(enrichedBookmark.createdAt)}</span>
            <div
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                }
              }}
              role="button"
              tabIndex={0}
            >
              <ResponsiveVerseActions
                verseKey={enrichedBookmark.verseKey!}
                isPlaying={isPlaying}
                isLoadingAudio={isLoadingAudio}
                isBookmarked={isVerseBookmarked}
                onPlayPause={handlePlayPause}
                onBookmark={handleRemoveBookmark}
                onNavigateToVerse={handleNavigateToVerse}
                showRemove={true}
                className="scale-75"
              />
            </div>
          </div>
        </div>

        {/* Compact verse preview */}
        <div className="space-y-2">
          {/* Arabic preview - truncated */}
          <div className="text-right">
            <p
              dir="rtl"
              className="text-foreground leading-relaxed text-lg line-clamp-2"
              style={{
                fontFamily: settings.arabicFontFace,
                fontSize: `${Math.min(settings.arabicFontSize, 20)}px`,
                lineHeight: 1.8,
              }}
              dangerouslySetInnerHTML={{
                __html: settings.tajweed
                  ? sanitizeHtml(applyTajweed(enrichedBookmark.verseText || ''))
                  : sanitizeHtml(enrichedBookmark.verseText || ''),
              }}
            />
          </div>

          {/* Translation preview - truncated */}
          {enrichedBookmark.translation && (
            <div>
              <p
                className="text-left leading-relaxed text-muted line-clamp-2 text-sm"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(enrichedBookmark.translation) }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </LoadingError>
  );
});
