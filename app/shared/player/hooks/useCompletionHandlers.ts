import { useMemo, type RefObject } from 'react';

import { Verse } from '@/types';

import { createCompletionHandlers, type CompletionHandlers } from './playbackCompletionHandlers';

import type { RepeatOptions } from '@/app/shared/player/types';

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

type CreateHandlersArgs = Parameters<typeof createCompletionHandlers>[0];

function buildCompletionArgs({
  repeatOptions,
  activeVerse,
  verseRepeatsLeft,
  playRepeatsLeft,
  controls,
  setVerseRepeatsLeft,
  setPlayRepeatsLeft,
  handleSurahRepeat,
  delayMs,
}: Options): CreateHandlersArgs {
  const { audioRef, onNext, onPrev, seek, play, pause, setIsPlaying, setPlayingId } = controls;
  return {
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
  };
}

//

export function useCompletionHandlers(options: Options): CompletionHandlers {
  const {
    repeatOptions,
    activeVerse,
    verseRepeatsLeft,
    playRepeatsLeft,
    controls,
    setVerseRepeatsLeft,
    setPlayRepeatsLeft,
    handleSurahRepeat,
    delayMs,
  } = options;

  const { audioRef, onNext, onPrev, seek, play, pause, setIsPlaying, setPlayingId } = controls;

  return useMemo(
    () =>
      createCompletionHandlers(
        buildCompletionArgs({
          repeatOptions,
          activeVerse,
          verseRepeatsLeft,
          playRepeatsLeft,
          controls: {
            audioRef,
            onNext,
            onPrev,
            seek,
            play,
            pause,
            setIsPlaying,
            setPlayingId,
          },
          setVerseRepeatsLeft,
          setPlayRepeatsLeft,
          handleSurahRepeat,
          delayMs,
        })
      ),
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
