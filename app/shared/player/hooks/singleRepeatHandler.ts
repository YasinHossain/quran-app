import { restartVerseWithDelay } from './repeatHelpers';

interface SingleRepeatArgs {
  verseRepeatsLeft: number;
  playRepeatsLeft: number;
  repeatEach: number;
  delay: number;
  seek: (s: number) => void;
  play: () => void;
  setVerseRepeatsLeft: (n: number) => void;
  setPlayRepeatsLeft: (n: number) => void;
}

export function createSingleRepeatHandler({
  verseRepeatsLeft,
  playRepeatsLeft,
  repeatEach,
  delay,
  seek,
  play,
  setVerseRepeatsLeft,
  setPlayRepeatsLeft,
}: SingleRepeatArgs): () => boolean {
  return () => {
    if (verseRepeatsLeft > 1) {
      setVerseRepeatsLeft(verseRepeatsLeft - 1);
      restartVerseWithDelay({ delay, seek, play });
      return true;
    }
    if (playRepeatsLeft > 1) {
      setPlayRepeatsLeft(playRepeatsLeft - 1);
      setVerseRepeatsLeft(repeatEach);
      restartVerseWithDelay({ delay, seek, play });
      return true;
    }
    return false;
  };
}

export type { SingleRepeatArgs };
