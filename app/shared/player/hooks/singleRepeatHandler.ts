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
  const restartWithDelay = (): void => {
    if (delay > 0) {
      setTimeout(() => {
        seek(0);
        play();
      }, delay);
      return;
    }
    seek(0);
    play();
  };

  return () => {
    if (verseRepeatsLeft > 1) {
      setVerseRepeatsLeft(verseRepeatsLeft - 1);
      restartWithDelay();
      return true;
    }
    if (playRepeatsLeft > 1) {
      setPlayRepeatsLeft(playRepeatsLeft - 1);
      setVerseRepeatsLeft(repeatEach);
      restartWithDelay();
      return true;
    }
    return false;
  };
}

export type { SingleRepeatArgs };
