'use client';
import { Verse as VerseType, Translation } from '@/types';
import { useAudio } from '@/app/shared/player/context/AudioContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import VerseActions from '@/app/shared/VerseActions';
import VerseActionsMobile from '@/app/shared/VerseActionsMobile';
import VerseArabic from '@/app/shared/VerseArabic';

interface VerseCardProps {
  verse: VerseType;
}

import { useCallback } from 'react';

export default function VerseCard({ verse }: VerseCardProps) {
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
      {/* Mobile Layout (sm and below) */}
      <div className="block md:hidden">
        <div className="mb-1">
          <VerseActionsMobile
            verseKey={verse.verse_key}
            isPlaying={isPlaying}
            isLoadingAudio={isLoadingAudio}
            isBookmarked={isVerseBookmarked}
            onPlayPause={handlePlayPause}
            onBookmark={handleBookmark}
            className=""
          />
        </div>
        <div className="space-y-6">
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

      {/* Desktop Layout (md and above) */}
      <div className="hidden md:flex">
        <VerseActions
          verseKey={verse.verse_key}
          isPlaying={isPlaying}
          isLoadingAudio={isLoadingAudio}
          isBookmarked={isVerseBookmarked}
          onPlayPause={handlePlayPause}
          onBookmark={handleBookmark}
          className="mr-4 w-14 pt-2 text-muted"
        />
        <div className="flex-grow space-y-6">
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
