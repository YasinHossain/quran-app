import { useEffect, Dispatch, SetStateAction } from 'react';

import { usePlaybackOptions } from './usePlaybackOptions';

import type { RepeatOptions } from '@/app/shared/player/types';

export function usePlaybackOptionsModal(
  open: boolean,
  onClose: () => void
): {
  readonly localReciter: string;
  readonly setLocalReciter: Dispatch<SetStateAction<string>>;
  readonly localRepeat: RepeatOptions;
  readonly setLocalRepeat: Dispatch<SetStateAction<RepeatOptions>>;
  readonly rangeWarning: string | null;
  readonly setRangeWarning: Dispatch<SetStateAction<string | null>>;
  readonly commit: () => void;
} {
  const {
    localReciter,
    setLocalReciter,
    localRepeat,
    setLocalRepeat,
    rangeWarning,
    setRangeWarning,
    commit,
  } = usePlaybackOptions(onClose);

  useEffect(() => {
    if (!open) setRangeWarning(null);
  }, [open, setRangeWarning]);

  return {
    localReciter,
    setLocalReciter,
    localRepeat,
    setLocalRepeat,
    rangeWarning,
    setRangeWarning,
    commit,
  } as const;
}
