'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { useQdcAudioFile } from '@/app/shared/player/hooks/useQdcAudioFile';
import { Spinner } from '@/app/shared/Spinner';

import type { Reciter, Track } from '@/app/shared/player/types';
import type { Verse } from '@/types';

// Loading fallback extracted to keep component lean
const LoadingFallback = (): React.JSX.Element => (
  <div className="flex justify-center items-center p-4 bg-surface rounded-lg">
    <Spinner className="h-4 w-4 md:h-5 md:w-5 text-accent" />
  </div>
);

// Dynamic import for heavy QuranAudioPlayer component
const QuranAudioPlayer = dynamic(
  (): Promise<{
    default: typeof import('@/app/shared/player/QuranAudioPlayer').QuranAudioPlayer;
  }> =>
    import('@/app/shared/player/QuranAudioPlayer').then(
      (
        mod: typeof import('@/app/shared/player/QuranAudioPlayer')
      ): {
        default: typeof import('@/app/shared/player/QuranAudioPlayer').QuranAudioPlayer;
      } => ({
        default: mod.QuranAudioPlayer,
      })
    ),
  { loading: (): React.JSX.Element => <LoadingFallback />, ssr: false }
);

interface AppAudioPlayerProps {
  activeVerse: Verse | null;
  reciter: Reciter;
  isVisible: boolean;
  onNext?: () => boolean;
  onPrev?: () => boolean;
}

function parseChapterIdFromVerse(verse: Verse): number | null {
  if (typeof verse.chapter_id === 'number' && Number.isFinite(verse.chapter_id)) {
    return verse.chapter_id;
  }
  const [surahRaw] = verse.verse_key.split(':');
  const parsed = Number.parseInt(surahRaw ?? '', 10);
  return Number.isFinite(parsed) ? parsed : null;
}

const createTrack = (
  verse: Verse,
  reciter: Reciter,
  audioUrl: string,
  startMs: number,
  endMs: number,
  surahLabel: string,
  locale: string,
  segments?: Array<[number, number, number]>
): Track => {
  const durationMs = Math.max(0, endMs - startMs);
  const segmentStartSec = startMs / 1000;
  const segmentEndSec = endMs / 1000;
  const wordSegments = segments?.map(([word, fromMs, toMs]) => ({
    word,
    start: Math.max(0, (fromMs - startMs) / 1000),
    end: Math.max(0, (toMs - startMs) / 1000),
  }));

  return {
    id: verse.id.toString(),
    title: `${surahLabel} ${formatVerseKey(verse.verse_key, locale)}`,
    artist: reciter.name,
    durationSec: durationMs / 1000,
    src: audioUrl,
    segmentStartSec,
    segmentEndSec,
    ...(wordSegments ? { wordSegments } : {}),
  };
};

function formatVerseKey(key: string, locale: string): string {
  try {
    const [surah, ayah] = key.split(':');
    if (!surah || !ayah) return key;
    const fmt = new Intl.NumberFormat(locale);
    return `${fmt.format(Number(surah))}:${fmt.format(Number(ayah))}`;
  } catch {
    return key;
  }
}

export const AppAudioPlayer = ({
  activeVerse,
  reciter,
  isVisible,
  onNext,
  onPrev,
}: AppAudioPlayerProps): React.JSX.Element | null => {
  const { t, i18n } = useTranslation();
  const { isHidden } = useHeaderVisibility();
  const surahLabel = t('surah_tab');

  // All hooks must be called before any conditional returns (React Rules of Hooks)
  const chapterId = useMemo(
    () => (activeVerse ? parseChapterIdFromVerse(activeVerse) : null),
    [activeVerse]
  );

  const { audioFile, isLoading, error } = useQdcAudioFile(reciter.id, chapterId, true);

  const track = useMemo(() => {
    if (!activeVerse || !audioFile) return null;
    const timing = audioFile.verseTimings.find((t) => t.verseKey === activeVerse.verse_key);
    if (!timing) return null;
    return createTrack(
      activeVerse,
      reciter,
      audioFile.audioUrl,
      timing.timestampFrom,
      timing.timestampTo,
      surahLabel,
      i18n.language,
      timing.segments
    );
  }, [activeVerse, audioFile, reciter, surahLabel, i18n.language]);

  const handleNext = useMemo(() => (): boolean => Boolean(onNext?.()), [onNext]);
  const handlePrev = useMemo(() => (): boolean => Boolean(onPrev?.()), [onPrev]);

  // Early return AFTER all hooks have been called
  if (!activeVerse || !isVisible) return null;

  const containerClass = `fixed left-0 right-0 p-4 bg-background/0 z-audio-player transition-all duration-300 ease-in-out ${isHidden ? 'bottom-0 pb-safe' : 'bottom-0 pb-safe lg:pb-4'
    } lg:left-1/2 lg:-translate-x-1/2 lg:right-auto lg:w-[min(90vw,60rem)]`;

  const containerStyle = {
    bottom: isHidden ? 'env(safe-area-inset-bottom)' : 'calc(5rem + env(safe-area-inset-bottom))',
  };

  if (isLoading) {
    return (
      <div className={containerClass} style={containerStyle}>
        <LoadingFallback />
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className={containerClass} style={containerStyle}>
        <div className="rounded-lg border border-border bg-surface p-4 text-sm text-muted">
          {t('unable_to_load_audio_for_reciter')}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass} style={containerStyle}>
      <QuranAudioPlayer track={track} onNext={handleNext} onPrev={handlePrev} />
    </div>
  );
};
