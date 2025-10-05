interface SingleRepeatArgs {
  verseRepeatsLeft: number;
  playRepeatsLeft: number;
  repeatEach: number;
  seek: (s: number) => void;
  play: () => void;
  setVerseRepeatsLeft: (n: number) => void;
  setPlayRepeatsLeft: (n: number) => void;
}

export function handleSingleRepeat({
  verseRepeatsLeft,
  playRepeatsLeft,
  repeatEach,
  seek,
  play,
  setVerseRepeatsLeft,
  setPlayRepeatsLeft,
}: SingleRepeatArgs): boolean {
  if (verseRepeatsLeft > 1) {
    setVerseRepeatsLeft(verseRepeatsLeft - 1);
    seek(0);
    play();
    return true;
  }
  if (playRepeatsLeft > 1) {
    setPlayRepeatsLeft(playRepeatsLeft - 1);
    setVerseRepeatsLeft(repeatEach);
    seek(0);
    play();
    return true;
  }
  return false;
}

export type { SingleRepeatArgs };
