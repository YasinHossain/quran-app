import { useEffect, useState } from 'react';

import { Verse } from '@/types';

import type { RepeatOptions } from '@/app/shared/player/types';

interface Options {
  repeatOptions: RepeatOptions;
  activeVerse: Verse | null;
}

interface RepeatState {
  verseRepeatsLeft: number;
  playRepeatsLeft: number;
  setVerseRepeatsLeft: (n: number) => void;
  setPlayRepeatsLeft: (n: number) => void;
}

export function useRepeatState({ repeatOptions, activeVerse }: Options): RepeatState {
  const [verseRepeatsLeft, setVerseRepeatsLeft] = useState(repeatOptions.repeatEach ?? 1);
  const [playRepeatsLeft, setPlayRepeatsLeft] = useState(repeatOptions.playCount ?? 1);
  const activeVerseId = activeVerse?.id;

  useEffect(() => {
    setVerseRepeatsLeft(repeatOptions.repeatEach ?? 1);
    setPlayRepeatsLeft(repeatOptions.playCount ?? 1);
  }, [
    repeatOptions.mode,
    repeatOptions.playCount,
    repeatOptions.repeatEach,
    repeatOptions.surahId,
    repeatOptions.start,
    repeatOptions.end,
    repeatOptions.verseNumber,
  ]);

  useEffect(() => {
    if (!activeVerseId) return;
    setVerseRepeatsLeft(repeatOptions.repeatEach ?? 1);
    if (repeatOptions.mode === 'single') {
      setPlayRepeatsLeft(repeatOptions.playCount ?? 1);
    }
  }, [activeVerseId, repeatOptions.mode, repeatOptions.repeatEach, repeatOptions.playCount]);

  return {
    verseRepeatsLeft,
    playRepeatsLeft,
    setVerseRepeatsLeft,
    setPlayRepeatsLeft,
  };
}
