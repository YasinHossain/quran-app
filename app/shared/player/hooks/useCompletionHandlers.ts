import { useMemo, RefObject } from 'react';

/* eslint-disable import/order, max-lines-per-function */
import { Verse } from '@/types';
import type { RepeatOptions } from '@/app/shared/player/types';

import { createCompletionHandlers, CompletionHandlers } from './playbackCompletionHandlers';

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

interface Options {
  repeatOptions: RepeatOptions;
  activeVerse: Verse | null;
  verseRepeatsLeft: number;
  playRepeatsLeft: number;
  controls: Controls;
  setVerseRepeatsLeft: (n: number) => void;
  setPlayRepeatsLeft: (n: number) => void;
  handleSurahRepeat: () => void;
  delayMs: number;
}

export function useCompletionHandlers({
  repeatOptions,
  activeVerse,
  verseRepeatsLeft,
  playRepeatsLeft,
  controls,
  setVerseRepeatsLeft,
  setPlayRepeatsLeft,
  handleSurahRepeat,
  delayMs,
}: Options): CompletionHandlers {
  const { audioRef, onNext, onPrev, seek, play, pause, setIsPlaying, setPlayingId } = controls;
  return useMemo(
    () =>
      createCompletionHandlers({
        start: repeatOptions.start ?? 1,
        end: repeatOptions.end ?? repeatOptions.start ?? 1,
        delay: delayMs,
        currentAyah: activeVerse ? parseInt(activeVerse.verse_key.split(':')[1], 10) : null,
        verseRepeatsLeft,
        playRepeatsLeft,
        repeatEach: repeatOptions.repeatEach ?? 1,
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
      }),
    [
      repeatOptions,
      activeVerse,
      delayMs,
      verseRepeatsLeft,
      playRepeatsLeft,
      audioRef,
      onNext,
      onPrev,
      seek,
      play,
      pause,
      setIsPlaying,
      setPlayingId,
      setVerseRepeatsLeft,
      setPlayRepeatsLeft,
      handleSurahRepeat,
    ]
  );
}
