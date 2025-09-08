/* eslint-disable max-lines, max-lines-per-function */
import { RefObject } from 'react';

interface SingleRepeatArgs {
  verseRepeatsLeft: number;
  playRepeatsLeft: number;
  repeatEach: number;
  seek: (s: number) => void;
  play: () => void;
  setVerseRepeatsLeft: (n: number) => void;
  setPlayRepeatsLeft: (n: number) => void;
}

export function handleSingleRepeat({
  verseRepeatsLeft,
  playRepeatsLeft,
  repeatEach,
  seek,
  play,
  setVerseRepeatsLeft,
  setPlayRepeatsLeft,
}: SingleRepeatArgs): boolean {
  if (verseRepeatsLeft > 1) {
    setVerseRepeatsLeft(verseRepeatsLeft - 1);
    seek(0);
    play();
    return true;
  }
  if (playRepeatsLeft > 1) {
    setPlayRepeatsLeft(playRepeatsLeft - 1);
    setVerseRepeatsLeft(repeatEach);
    seek(0);
    play();
    return true;
  }
  return false;
}

interface RangeRepeatArgs {
  start: number;
  end: number;
  currentAyah: number | null;
  delay: number;
  verseRepeatsLeft: number;
  repeatEach: number;
  onNext?: () => boolean;
  onPrev?: () => boolean;
  seek: (s: number) => void;
  play: () => void;
  setVerseRepeatsLeft: (n: number) => void;
  setPlayRepeatsLeft: (n: number) => void;
  playRepeatsLeft: number;
}

export function handleRangeRepeat({
  start,
  end,
  currentAyah,
  delay,
  verseRepeatsLeft,
  repeatEach,
  onNext,
  onPrev,
  seek,
  play,
  setVerseRepeatsLeft,
  setPlayRepeatsLeft,
  playRepeatsLeft,
}: RangeRepeatArgs): boolean {
  if (verseRepeatsLeft > 1) {
    setVerseRepeatsLeft(verseRepeatsLeft - 1);
    seek(0);
    play();
    return true;
  }
  setVerseRepeatsLeft(repeatEach);
  if (currentAyah && currentAyah < end) {
    onNext?.();
    return true;
  }
  if (playRepeatsLeft > 1) {
    setPlayRepeatsLeft(playRepeatsLeft - 1);
    const steps = end - start;
    setTimeout(() => {
      for (let i = 0; i < steps; i++) onPrev?.();
    }, delay);
    return true;
  }
  return false;
}

interface FinalizeArgs {
  onNext?: () => boolean;
  audioRef: RefObject<HTMLAudioElement | null>;
  pause: () => void;
  setIsPlaying: (v: boolean) => void;
  setPlayingId: (v: number | null) => void;
}

export function finalizePlayback({
  onNext,
  audioRef,
  pause,
  setIsPlaying,
  setPlayingId,
}: FinalizeArgs): void {
  const hasNext = onNext?.() ?? false;
  setTimeout(() => {
    if (!hasNext || !audioRef.current?.src) {
      pause();
      setIsPlaying(false);
      setPlayingId(null);
    }
  }, 0);
}

export interface CompletionHandlers {
  single: () => boolean;
  range: () => boolean;
  surah: () => void;
  default: () => void;
}

interface CreateHandlersArgs {
  start: number;
  end: number;
  delay: number;
  currentAyah: number | null;
  verseRepeatsLeft: number;
  playRepeatsLeft: number;
  repeatEach: number;
  onNext?: () => boolean;
  onPrev?: () => boolean;
  seek: (s: number) => void;
  play: () => void;
  pause: () => void;
  audioRef: RefObject<HTMLAudioElement | null>;
  setVerseRepeatsLeft: (n: number) => void;
  setPlayRepeatsLeft: (n: number) => void;
  setIsPlaying: (v: boolean) => void;
  setPlayingId: (v: number | null) => void;
  handleSurahRepeat: () => void;
}

export function createCompletionHandlers({
  start,
  end,
  delay,
  currentAyah,
  verseRepeatsLeft,
  playRepeatsLeft,
  repeatEach,
  onNext,
  onPrev,
  seek,
  play,
  pause,
  audioRef,
  setVerseRepeatsLeft,
  setPlayRepeatsLeft,
  setIsPlaying,
  setPlayingId,
  handleSurahRepeat,
}: CreateHandlersArgs): CompletionHandlers {
  return {
    single: () =>
      handleSingleRepeat({
        verseRepeatsLeft,
        playRepeatsLeft,
        repeatEach,
        seek,
        play,
        setVerseRepeatsLeft,
        setPlayRepeatsLeft,
      }),
    range: () =>
      handleRangeRepeat({
        start,
        end,
        currentAyah,
        delay,
        verseRepeatsLeft,
        repeatEach,
        onNext,
        onPrev,
        seek,
        play,
        setVerseRepeatsLeft,
        setPlayRepeatsLeft,
        playRepeatsLeft,
      }),
    surah: handleSurahRepeat,
    default: () => finalizePlayback({ onNext, audioRef, pause, setIsPlaying, setPlayingId }),
  };
}
