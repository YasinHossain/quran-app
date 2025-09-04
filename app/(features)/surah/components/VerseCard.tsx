'use client';

// app/(features)/surah/[surahId]/components/Verse.tsx
import { memo, useCallback, useEffect, useRef } from 'react';
import { Verse as VerseType, Translation } from '@/types';
import { useAudio } from '@/app/shared/player/context/AudioContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { ResponsiveVerseActions } from '@/app/shared/ResponsiveVerseActions';
import { VerseArabic } from '@/app/shared/VerseArabic';

interface VerseProps {
  verse: VerseType;
}

/**
 * Memoized to prevent unnecessary rerenders when `verse` prop
 * and context values are stable.
 */
export const Verse = memo(function Verse({ verse }: VerseProps) {
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
  const { isBookmarked, setLastRead } = useBookmarks();
  const verseRef = useRef<HTMLDivElement | null>(null);
  const isPlaying = playingId === verse.id;
  const isLoadingAudio = loadingId === verse.id;
  const isVerseBookmarked = isBookmarked(String(verse.id));

  useEffect(() => {
    if (!verseRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const [surahId] = verse.verse_key.split(':');
          setLastRead(surahId, verse.id);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(verseRef.current);
    return () => observer.disconnect();
  }, [verse.verse_key, verse.id, setLastRead]);

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

  return (
    <div id={`verse-${verse.id}`} ref={verseRef} className="mb-8 pb-8 border-b border-border">
      {/* Mobile: stacked layout, Desktop: side-by-side */}
      <div className="space-y-4 md:space-y-0 md:flex md:items-start md:gap-x-6">
        {/* Verse actions */}
        <ResponsiveVerseActions
          verseKey={verse.verse_key}
          verseId={String(verse.id)}
          isPlaying={isPlaying}
          isLoadingAudio={isLoadingAudio}
          isBookmarked={isVerseBookmarked}
          onPlayPause={handlePlayPause}
          className="md:w-16 md:pt-1"
        />

        {/* Main content area */}
        <div className="space-y-6 md:flex-grow">
          <VerseArabic verse={verse} />
          {/* TRANSLATIONS */}
          {verse.translations?.map((t: Translation) => (
            <div key={t.resource_id}>
              <p
                className="text-left leading-relaxed text-foreground"
                style={{ fontSize: `${settings.translationFontSize}px` }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(t.text) }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default Verse;
