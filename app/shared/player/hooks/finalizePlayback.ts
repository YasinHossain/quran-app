import { RefObject } from 'react';

interface FinalizeArgs {
  onNext?: () => boolean;
  audioRef: RefObject<HTMLAudioElement | null>;
  pause: () => void;
  setIsPlaying: (v: boolean) => void;
  setPlayingId: (v: number | null) => void;
}

export function finalizePlayback({
  onNext,
  audioRef,
  pause,
  setIsPlaying,
  setPlayingId,
}: FinalizeArgs): void {
  const hasNext = onNext?.() ?? false;
  setTimeout(() => {
    if (!hasNext || !audioRef.current?.src) {
      pause();
      setIsPlaying(false);
      setPlayingId(null);
    }
  }, 0);
}

export type { FinalizeArgs };
