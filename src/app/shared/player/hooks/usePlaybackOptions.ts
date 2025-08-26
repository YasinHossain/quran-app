import { useEffect, useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { RECITERS } from '@/lib/audio/reciters';
import type { RepeatOptions } from '../types';

export default function usePlaybackOptions(onClose: () => void) {
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

  const commit = () => {
    const numericKeys: (keyof RepeatOptions)[] = [
      'start',
      'end',
      'playCount',
      'repeatEach',
      'delay',
    ];
    if (
      numericKeys.some((key) => {
        const val = localRepeat[key];
        return val !== undefined && !Number.isInteger(val);
      })
    ) {
      setRangeWarning('Please enter whole numbers only.');
      return;
    }
    const newReciter = RECITERS.find((r) => r.id.toString() === localReciter);
    if (newReciter) setReciter(newReciter);
    const start = Math.max(1, localRepeat.start ?? 1);
    const end = Math.max(start, localRepeat.end ?? start);
    if (start !== localRepeat.start || end !== localRepeat.end) {
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
