import { useCallback, useEffect, useState, RefObject } from 'react';

import { Verse } from '@/types';

import { useCompletionHandlers } from './useCompletionHandlers';
import { useSurahRepeat } from './useSurahRepeat';

import type { RepeatOptions } from '@/app/shared/player/types';

interface Options {
  audioRef: RefObject<HTMLAudioElement | null>;
  repeatOptions: RepeatOptions;
  activeVerse: Verse | null;
  onNext?: () => boolean;
  onPrev?: () => boolean;
  seek: (s: number) => void;
  play: () => void;
  pause: () => void;
  setIsPlaying: (v: boolean) => void;
  setPlayingId: (v: number | null) => void;
}

export function usePlaybackCompletion(options: Options): () => void {
  const {
    audioRef,
    repeatOptions,
    activeVerse,
    onNext,
    onPrev,
    seek,
    play,
    pause,
    setIsPlaying,
    setPlayingId,
  } = options;

  const [verseRepeatsLeft, setVerseRepeatsLeft] = useState(repeatOptions.repeatEach ?? 1);
  const [playRepeatsLeft, setPlayRepeatsLeft] = useState(repeatOptions.playCount ?? 1);
  useEffect(() => {
    setVerseRepeatsLeft(repeatOptions.repeatEach ?? 1);
    setPlayRepeatsLeft(repeatOptions.playCount ?? 1);
  }, [activeVerse, repeatOptions.repeatEach, repeatOptions.playCount]);

  const delayMs = (repeatOptions.delay ?? 0) * 1000;
  const controls = { audioRef, onNext, onPrev, seek, play, pause, setIsPlaying, setPlayingId };
  const handleSurahRepeat = useSurahRepeat({
    ...controls,
    verseRepeatsLeft,
    playRepeatsLeft,
    repeatEach: repeatOptions.repeatEach ?? 1,
    delay: delayMs,
    setVerseRepeatsLeft,
    setPlayRepeatsLeft,
  });
  const handlers = useCompletionHandlers({
    repeatOptions,
    activeVerse,
    verseRepeatsLeft,
    playRepeatsLeft,
    controls,
    setVerseRepeatsLeft,
    setPlayRepeatsLeft,
    handleSurahRepeat,
    delayMs,
  });

  return useCallback(() => {
    const handled = handlers[repeatOptions.mode]?.();
    if (!handled) handlers.default();
  }, [handlers, repeatOptions.mode]);
}
