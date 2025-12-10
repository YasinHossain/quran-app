import { useCallback } from 'react';

import { restartVerseWithDelay } from './repeatHelpers';

type RepeatArgs = {
  verseRepeatsLeft: number;
  playRepeatsLeft: number;
  repeatEach: number;
  delay: number;
  onNext?: () => boolean;
  onPrev?: () => boolean;
  seek: (s: number) => void;
  play: () => void;
  pause: () => void;
  setIsPlaying: (v: boolean) => void;
  setPlayingId: (v: number | null) => void;
  setVerseRepeatsLeft: (n: number) => void;
  setPlayRepeatsLeft: (n: number) => void;
};

function restartCurrentVerse({
  verseRepeatsLeft,
  delay,
  setVerseRepeatsLeft,
  seek,
  play,
}: RepeatArgs): void {
  setVerseRepeatsLeft(verseRepeatsLeft - 1);
  restartVerseWithDelay({ delay, seek, play });
}

function rewindToSurahStart({ onPrev, delay }: RepeatArgs): void {
  if (!onPrev) return;
  const rewind = (): void => {
    let hasPrev = true;
    while (hasPrev) hasPrev = onPrev?.() ?? false;
  };
  if (delay > 0) {
    setTimeout(rewind, delay);
    return;
  }
  rewind();
}

function stopPlayback({ pause, setIsPlaying, setPlayingId }: RepeatArgs): void {
  pause();
  setIsPlaying(false);
  setPlayingId(null);
}

export function handleSurahRepeat(args: RepeatArgs): void {
  const { verseRepeatsLeft, repeatEach, playRepeatsLeft, setVerseRepeatsLeft, setPlayRepeatsLeft } =
    args;

  if (verseRepeatsLeft > 1) {
    restartCurrentVerse(args);
    return;
  }

  setVerseRepeatsLeft(repeatEach);
  const hasAdvanced = args.onNext?.() ?? false;
  if (hasAdvanced) return;

  if (playRepeatsLeft > 1 && args.onPrev) {
    setPlayRepeatsLeft(playRepeatsLeft - 1);
    setVerseRepeatsLeft(repeatEach);
    rewindToSurahStart(args);
    return;
  }

  setTimeout(() => stopPlayback(args), 0);
}

/**
 * Provides a memoized callback for handling surah repeat logic.
 *
 * @param params repeat state and audio controls.
 * @returns function to execute the repeat routine.
 */
export function useSurahRepeat({
  verseRepeatsLeft,
  playRepeatsLeft,
  repeatEach,
  delay,
  onNext,
  onPrev,
  seek,
  play,
  pause,
  setIsPlaying,
  setPlayingId,
  setVerseRepeatsLeft,
  setPlayRepeatsLeft,
}: Parameters<typeof handleSurahRepeat>[0]): () => void {
  return useCallback(
    () =>
      handleSurahRepeat({
        verseRepeatsLeft,
        playRepeatsLeft,
        repeatEach,
        delay,
        ...(onNext ? { onNext } : {}),
        ...(onPrev ? { onPrev } : {}),
        seek,
        play,
        pause,
        setIsPlaying,
        setPlayingId,
        setVerseRepeatsLeft,
        setPlayRepeatsLeft,
      }),
    [
      verseRepeatsLeft,
      playRepeatsLeft,
      repeatEach,
      delay,
      onNext,
      onPrev,
      seek,
      play,
      pause,
      setIsPlaying,
      setPlayingId,
      setVerseRepeatsLeft,
      setPlayRepeatsLeft,
    ]
  );
}
