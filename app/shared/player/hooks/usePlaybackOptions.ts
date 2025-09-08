import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { RECITERS } from '@/lib/audio/reciters';

import { useAudio } from '../context/AudioContext';

import type { RepeatOptions } from '../types';

/**
 * Local state manager for playback options and reciter selection.
 *
 * @param onClose callback to close the options modal.
 * @returns current selections and helpers to commit changes.
 */
interface UsePlaybackOptionsReturn {
  localReciter: string;
  setLocalReciter: Dispatch<SetStateAction<string>>;
  localRepeat: RepeatOptions;
  setLocalRepeat: Dispatch<SetStateAction<RepeatOptions>>;
  rangeWarning: string | null;
  setRangeWarning: Dispatch<SetStateAction<string | null>>;
  commit: () => void;
}

export function usePlaybackOptions(onClose: () => void): UsePlaybackOptionsReturn {
  const { reciter, setReciter, repeatOptions, setRepeatOptions } = useAudio();
  const [localReciter, setLocalReciter] = useState(reciter.id.toString());
  const [localRepeat, setLocalRepeat] = useState<RepeatOptions>(repeatOptions);
  const [rangeWarning, setRangeWarning] = useState<string | null>(null);

  useEffect(() => {
    setLocalReciter(reciter.id.toString());
  }, [reciter]);

  useEffect(() => {
    setLocalRepeat(repeatOptions);
  }, [repeatOptions]);

  const commit = (): void => {
    if (hasNonIntegerValues(localRepeat)) {
      setRangeWarning('Please enter whole numbers only.');
      return;
    }
    const newReciter = RECITERS.find((r) => r.id.toString() === localReciter);
    if (newReciter) setReciter(newReciter);
    const { start, end, adjusted } = adjustRange(localRepeat);
    if (adjusted) {
      setRangeWarning('Start and end values adjusted to a valid range.');
      setLocalRepeat({ ...localRepeat, start, end });
      return;
    }
    setRangeWarning(null);
    setRepeatOptions({ ...localRepeat, start, end });
    onClose();
  };

  return {
    localReciter,
    setLocalReciter,
    localRepeat,
    setLocalRepeat,
    rangeWarning,
    setRangeWarning,
    commit,
  };
}

function hasNonIntegerValues(opts: RepeatOptions): boolean {
  const numericKeys: (keyof RepeatOptions)[] = ['start', 'end', 'playCount', 'repeatEach', 'delay'];
  return numericKeys.some((key) => {
    const val = opts[key];
    return val !== undefined && !Number.isInteger(val);
  });
}

function adjustRange(opts: RepeatOptions): { start: number; end: number; adjusted: boolean } {
  const start = Math.max(1, opts.start ?? 1);
  const end = Math.max(start, opts.end ?? start);
  return { start, end, adjusted: start !== opts.start || end !== opts.end };
}
