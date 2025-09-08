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

  useEffect(() => {
    setVerseRepeatsLeft(repeatOptions.repeatEach ?? 1);
    setPlayRepeatsLeft(repeatOptions.playCount ?? 1);
  }, [activeVerse, repeatOptions.repeatEach, repeatOptions.playCount]);

  return {
    verseRepeatsLeft,
    playRepeatsLeft,
    setVerseRepeatsLeft,
    setPlayRepeatsLeft,
  };
}
