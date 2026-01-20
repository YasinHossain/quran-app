import { useEffect, useRef } from 'react';

import type { Track } from '@/app/shared/player/types';

interface Options {
  track?: Track | null;
  isPlaying: boolean;
  current: number;
  duration: number;
  handleEnded: () => void;
}

const END_EPSILON_SEC = 0.05;

function isSegmentedTrack(track?: Track | null): boolean {
  return (
    typeof track?.segmentStartSec === 'number' &&
    Number.isFinite(track.segmentStartSec) &&
    typeof track?.segmentEndSec === 'number' &&
    Number.isFinite(track.segmentEndSec) &&
    track.segmentEndSec > track.segmentStartSec
  );
}

export function useSegmentCompletion({
  track,
  isPlaying,
  current,
  duration,
  handleEnded,
}: Options): void {
  const wasAtEndRef = useRef(false);

  useEffect(() => {
    if (!isSegmentedTrack(track)) {
      wasAtEndRef.current = false;
      return;
    }

    if (!isPlaying || duration <= 0) {
      wasAtEndRef.current = false;
      return;
    }

    // Only consider "near end" if current time is actually positive
    // This prevents false triggers on initial load when current=0 and duration is small
    const nearEnd = current > 0 && current >= duration - END_EPSILON_SEC;
    if (nearEnd && !wasAtEndRef.current) {
      wasAtEndRef.current = true;
      handleEnded();
      return;
    }

    if (!nearEnd) {
      wasAtEndRef.current = false;
    }
  }, [
    track?.segmentStartSec,
    track?.segmentEndSec,
    isPlaying,
    current,
    duration,
    handleEnded,
    track,
  ]);
}
