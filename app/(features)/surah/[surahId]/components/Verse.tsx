// app/(features)/surah/[surahId]/components/Verse.tsx
import { memo, useCallback } from 'react';
import { Verse as VerseType, Translation } from '@/types';
import { useAudio } from '@/app/(features)/player/context/AudioContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import VerseActions from '@/app/shared/VerseActions';
import VerseArabic from '@/app/shared/VerseArabic';

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
  const { settings, bookmarkedVerses, toggleBookmark } = useSettings();
  const isPlaying = playingId === verse.id;
  const isLoadingAudio = loadingId === verse.id;
  const isBookmarked = bookmarkedVerses.includes(String(verse.id));

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
    toggleBookmark(String(verse.id));
  }, [toggleBookmark, verse.id]);

  return (
    <>
      <div className="flex items-start gap-x-6 mb-12 pb-8 border-b border-[var(--border-color)]">
        <VerseActions
          verseKey={verse.verse_key}
          isPlaying={isPlaying}
          isLoadingAudio={isLoadingAudio}
          isBookmarked={isBookmarked}
          onPlayPause={handlePlayPause}
          onBookmark={handleBookmark}
          className="w-16 pt-1"
        />
        <div className="flex-grow space-y-6">
          <VerseArabic verse={verse} />
          {/* TRANSLATIONS */}
          {verse.translations?.map((t: Translation) => (
            <div key={t.resource_id}>
              <p
                className="text-left leading-relaxed text-[var(--foreground)]"
                style={{ fontSize: `${settings.translationFontSize}px` }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(t.text) }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
});
