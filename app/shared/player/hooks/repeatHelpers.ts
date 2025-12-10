interface RestartArgs {
  delay: number;
  seek: (s: number) => void;
  play: () => void;
}

export function restartVerseWithDelay({ delay, seek, play }: RestartArgs): void {
  if (delay > 0) {
    setTimeout(() => {
      seek(0);
      play();
    }, delay);
    return;
  }
  seek(0);
  play();
}

export type { RestartArgs };
