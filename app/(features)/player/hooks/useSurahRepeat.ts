import { useCallback } from 'react';

export function handleSurahRepeat({
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
}: {
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
}) {
  if (verseRepeatsLeft > 1) {
    setVerseRepeatsLeft(verseRepeatsLeft - 1);
    seek(0);
    play();
    return;
  }
  setVerseRepeatsLeft(repeatEach);
  const hasNext = onNext?.() ?? false;
  if (hasNext) return;
  if (playRepeatsLeft > 1) {
    setPlayRepeatsLeft(playRepeatsLeft - 1);
    setVerseRepeatsLeft(repeatEach);
    setTimeout(() => {
      let hasPrev = true;
      while (hasPrev) {
        hasPrev = onPrev?.() ?? false;
      }
    }, delay);
    return;
  }
  setTimeout(() => {
    pause();
    setIsPlaying(false);
    setPlayingId(null);
  }, 0);
}

export default function useSurahRepeat({
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
}: Parameters<typeof handleSurahRepeat>[0]) {
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
