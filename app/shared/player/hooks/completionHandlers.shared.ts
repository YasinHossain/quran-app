import { Verse } from '@/types';

import type { createCompletionHandlers } from './playbackCompletionHandlers';
import type { RepeatOptions } from '@/app/shared/player/types';
import type { RefObject } from 'react';

type CreateHandlersArgs = Parameters<typeof createCompletionHandlers>[0];

interface Controls {
  audioRef: RefObject<HTMLAudioElement | null>;
  onNext?: () => boolean;
  onPrev?: () => boolean;
  seek: (s: number) => void;
  play: () => void;
  pause: () => void;
  setIsPlaying: (v: boolean) => void;
  setPlayingId: (v: number | null) => void;
}

interface SanitizedControls {
  audioRef: Controls['audioRef'];
  seek: Controls['seek'];
  play: Controls['play'];
  pause: Controls['pause'];
  setIsPlaying: Controls['setIsPlaying'];
  setPlayingId: Controls['setPlayingId'];
  onNext?: () => boolean;
  onPrev?: () => boolean;
}

interface CompletionOptions {
  repeatOptions: RepeatOptions;
  activeVerse: Verse | null;
  verseRepeatsLeft: number;
  playRepeatsLeft: number;
  controls: SanitizedControls;
  setVerseRepeatsLeft: (n: number) => void;
  setPlayRepeatsLeft: (n: number) => void;
  handleSurahRepeat: () => void;
  delayMs: number;
}

const parseCurrentAyah = (activeVerse: Verse | null): number | null => {
  if (!activeVerse) return null;
  const [, ayah = '0'] = activeVerse.verse_key.split(':');
  return Number.parseInt(ayah, 10);
};

const sanitizeControls = ({
  audioRef,
  onNext,
  onPrev,
  seek,
  play,
  pause,
  setIsPlaying,
  setPlayingId,
}: Controls): SanitizedControls => ({
  audioRef,
  seek,
  play,
  pause,
  setIsPlaying,
  setPlayingId,
  ...(onNext ? { onNext } : {}),
  ...(onPrev ? { onPrev } : {}),
});

const buildCompletionArgs = ({
  repeatOptions,
  activeVerse,
  verseRepeatsLeft,
  playRepeatsLeft,
  controls,
  setVerseRepeatsLeft,
  setPlayRepeatsLeft,
  handleSurahRepeat,
  delayMs,
}: CompletionOptions): CreateHandlersArgs => {
  const start = repeatOptions.start ?? 1;
  const end = repeatOptions.end ?? repeatOptions.start ?? 1;
  const repeatEach = repeatOptions.repeatEach ?? 1;

  return {
    start,
    end,
    delay: delayMs,
    currentAyah: parseCurrentAyah(activeVerse),
    verseRepeatsLeft,
    playRepeatsLeft,
    repeatEach,
    ...controls,
    setVerseRepeatsLeft,
    setPlayRepeatsLeft,
    handleSurahRepeat,
  };
};

export type { CompletionOptions, Controls, SanitizedControls };
export { buildCompletionArgs, sanitizeControls };
