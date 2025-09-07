'use client';
import { useCallback } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { useAudio } from '@/app/shared/player/context/AudioContext';
import { ResponsiveVerseActions } from '@/app/shared/ResponsiveVerseActions';
import { VerseArabic } from '@/app/shared/VerseArabic';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { Translation, Verse as VerseType } from '@/types';

interface VerseCardProps {
  verse: VerseType;
}

export function VerseCard({ verse }: VerseCardProps) {
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
  const { addBookmark, removeBookmark, findBookmark, isBookmarked } = useBookmarks();

  const isPlaying = playingId === verse.id;
  const isLoadingAudio = loadingId === verse.id;
  const isVerseBookmarked = isBookmarked(String(verse.id));

  const handlePlayPause = useCallback(() => {
    if (playingId === verse.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      setLoadingId(null);
      setActiveVerse(null);
      setIsPlaying(false);
    } else {
      setActiveVerse(verse);
      setPlayingId(verse.id);
      setLoadingId(verse.id);
      setIsPlaying(true);
      openPlayer();
    }
  }, [
    playingId,
    verse,
    audioRef,
    setActiveVerse,
    setPlayingId,
    setLoadingId,
    setIsPlaying,
    openPlayer,
  ]);

  const handleBookmark = useCallback(() => {
    const verseId = String(verse.id);
    const bookmarkInfo = findBookmark(verseId);
    if (bookmarkInfo) {
      removeBookmark(verseId, bookmarkInfo.folder.id);
    } else {
      addBookmark(verseId);
    }
  }, [addBookmark, removeBookmark, findBookmark, verse.id]);

  return (
    <div className="relative rounded-md border bg-surface p-6 shadow">
      {/* Mobile: stacked layout, Desktop: side-by-side */}
      <div className="space-y-4 md:space-y-0 md:flex md:items-start md:gap-x-6">
        {/* Verse actions */}
        <ResponsiveVerseActions
          verseKey={verse.verse_key}
          isPlaying={isPlaying}
          isLoadingAudio={isLoadingAudio}
          isBookmarked={isVerseBookmarked}
          onPlayPause={handlePlayPause}
          onBookmark={handleBookmark}
          className="md:w-16 md:pt-1"
        />

        {/* Main content area */}
        <div className="space-y-6 md:flex-grow">
          <VerseArabic verse={verse} />
          {verse.translations?.map((t: Translation) => (
            <div key={t.resource_id}>
              <p
                className="text-left leading-relaxed"
                style={{ fontSize: `${settings.translationFontSize}px` }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(t.text) }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
