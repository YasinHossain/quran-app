interface RangeRepeatArgs {
  start: number;
  end: number;
  currentAyah: number | null;
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
}

export function handleRangeRepeat({
  start,
  end,
  currentAyah,
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
}: RangeRepeatArgs): boolean {
  if (verseRepeatsLeft > 1) {
    setVerseRepeatsLeft(verseRepeatsLeft - 1);
    seek(0);
    play();
    return true;
  }
  setVerseRepeatsLeft(repeatEach);
  if (currentAyah && currentAyah < end) {
    onNext?.();
    return true;
  }
  if (playRepeatsLeft > 1) {
    setPlayRepeatsLeft(playRepeatsLeft - 1);
    const steps = end - start;
    setTimeout(() => {
      for (let i = 0; i < steps; i++) onPrev?.();
    }, delay);
    return true;
  }
  return false;
}

export type { RangeRepeatArgs };
