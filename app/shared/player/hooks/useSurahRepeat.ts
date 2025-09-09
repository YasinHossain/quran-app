import { useCallback } from 'react';

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
  setVerseRepeatsLeft,
  seek,
  play,
}: RepeatArgs): void {
  setVerseRepeatsLeft(verseRepeatsLeft - 1);
  seek(0);
  play();
}

function tryAdvanceOrLoopSurah({
  repeatEach,
  playRepeatsLeft,
  setPlayRepeatsLeft,
  setVerseRepeatsLeft,
  onNext,
  onPrev,
  delay,
}: RepeatArgs): boolean {
  setVerseRepeatsLeft(repeatEach);
  const hasNext = onNext?.() ?? false;
  if (hasNext) return true;
  if (playRepeatsLeft > 1) {
    setPlayRepeatsLeft(playRepeatsLeft - 1);
    setVerseRepeatsLeft(repeatEach);
    setTimeout(() => {
      let hasPrev = true;
      while (hasPrev) hasPrev = onPrev?.() ?? false;
    }, delay);
    return true;
  }
  return false;
}

function stopPlayback({ pause, setIsPlaying, setPlayingId }: RepeatArgs): void {
  pause();
  setIsPlaying(false);
  setPlayingId(null);
}

export function handleSurahRepeat(args: RepeatArgs): void {
  const { verseRepeatsLeft } = args;
  if (verseRepeatsLeft > 1) return restartCurrentVerse(args);
  if (!tryAdvanceOrLoopSurah(args)) setTimeout(() => stopPlayback(args), 0);
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
        onNext,
        onPrev,
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
