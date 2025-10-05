import { useMemo } from 'react';

import {
  buildCompletionArgs,
  sanitizeControls,
  type CompletionOptions,
  type Controls,
  type SanitizedControls,
} from './completionHandlers.shared';
import { createCompletionHandlers, type CompletionHandlers } from './playbackCompletionHandlers';

interface UseCompletionHandlersOptions extends Omit<CompletionOptions, 'controls'> {
  controls: Controls;
}

function useSanitizedControls(controls: Controls): SanitizedControls {
  const { audioRef, onNext, onPrev, seek, play, pause, setIsPlaying, setPlayingId } = controls;

  return useMemo(() => {
    const rawControls: Controls = { audioRef, seek, play, pause, setIsPlaying, setPlayingId };
    if (onNext) rawControls.onNext = onNext;
    if (onPrev) rawControls.onPrev = onPrev;
    return sanitizeControls(rawControls);
  }, [audioRef, onNext, onPrev, seek, play, pause, setIsPlaying, setPlayingId]);
}

export function useCompletionHandlers(options: UseCompletionHandlersOptions): CompletionHandlers {
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

  const sanitizedControls = useSanitizedControls(controls);

  return useMemo(
    () =>
      createCompletionHandlers(
        buildCompletionArgs({
          repeatOptions,
          activeVerse,
          verseRepeatsLeft,
          playRepeatsLeft,
          controls: sanitizedControls,
          setVerseRepeatsLeft,
          setPlayRepeatsLeft,
          handleSurahRepeat,
          delayMs,
        })
      ),
    [
      repeatOptions,
      activeVerse,
      verseRepeatsLeft,
      playRepeatsLeft,
      sanitizedControls,
      setVerseRepeatsLeft,
      setPlayRepeatsLeft,
      handleSurahRepeat,
      delayMs,
    ]
  );
}

export type { Controls };

export { sanitizeControls };
