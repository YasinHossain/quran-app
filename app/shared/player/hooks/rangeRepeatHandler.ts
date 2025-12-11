import { compareVerseKeys } from '@/app/shared/player/utils/repeat';

import { restartVerseWithDelay } from './repeatHelpers';

interface RangeRepeatArgs {
  start: number;
  end: number;
  startKey?: string | null;
  endKey?: string | null;
  currentAyah: number | null;
  currentKey?: string | null;
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
  rangeSize?: number;
}

export function createRangeRepeatHandler({
  start,
  end,
  startKey,
  endKey,
  currentAyah,
  currentKey,
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
  rangeSize,
}: RangeRepeatArgs): () => boolean {
  const shouldAdvance = (): boolean => {
    if (currentKey && endKey) {
      return compareVerseKeys(currentKey, endKey) < 0;
    }
    if (currentAyah !== null) return currentAyah < end;
    return false;
  };

  const getRewindSteps = (): number => {
    if (rangeSize && rangeSize > 0) return Math.max(0, rangeSize - 1);
    return Math.max(0, end - start);
  };

  const restartRange = (): void => {
    const steps = getRewindSteps();
    if (steps <= 0) {
      restartVerseWithDelay({ delay, seek, play });
      return;
    }
    setTimeout(() => {
      for (let i = 0; i < steps; i += 1) {
        onPrev?.();
      }
    }, delay);
  };

  return () => {
    if (verseRepeatsLeft > 1) {
      setVerseRepeatsLeft(verseRepeatsLeft - 1);
      restartVerseWithDelay({ delay, seek, play });
      return true;
    }
    setVerseRepeatsLeft(repeatEach);
    if (shouldAdvance()) {
      onNext?.();
      return true;
    }
    if (playRepeatsLeft > 1) {
      setPlayRepeatsLeft(playRepeatsLeft - 1);
      restartRange();
      return true;
    }
    return false;
  };
}

export type { RangeRepeatArgs };
