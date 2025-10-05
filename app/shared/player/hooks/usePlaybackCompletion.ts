import { useCallback, RefObject } from 'react';

import { Verse } from '@/types';

import { useCompletionHandlers, sanitizeControls, type Controls } from './useCompletionHandlers';
import { useRepeatState } from './useRepeatState';
import { useSurahRepeat } from './useSurahRepeat';

import type { CompletionHandlers } from './playbackCompletionHandlers';
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

const createSanitizedControls = ({
  audioRef,
  onNext,
  onPrev,
  seek,
  play,
  pause,
  setIsPlaying,
  setPlayingId,
}: Options): ReturnType<typeof sanitizeControls> => {
  const rawControls: Controls = { audioRef, seek, play, pause, setIsPlaying, setPlayingId };

  if (onNext) rawControls.onNext = onNext;
  if (onPrev) rawControls.onPrev = onPrev;

  return sanitizeControls(rawControls);
};

const runModeHandler = (mode: RepeatOptions['mode'], handlers: CompletionHandlers): boolean => {
  const handlerMap: Partial<Record<RepeatOptions['mode'], () => boolean>> = {
    single: handlers.single,
    range: handlers.range,
    surah: () => {
      handlers.surah();
      return true;
    },
  };
  const handler = handlerMap[mode];
  return handler ? handler() : false;
};

export function usePlaybackCompletion(options: Options): () => void {
  const { repeatOptions, activeVerse } = options;

  const { verseRepeatsLeft, playRepeatsLeft, setVerseRepeatsLeft, setPlayRepeatsLeft } =
    useRepeatState({ repeatOptions, activeVerse });

  const delayMs = (repeatOptions.delay ?? 0) * 1000;
  const controls = createSanitizedControls(options);

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
    if (!runModeHandler(repeatOptions.mode, handlers)) {
      handlers.default();
    }
  }, [handlers, repeatOptions.mode]);
}
