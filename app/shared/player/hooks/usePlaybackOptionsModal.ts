import { useEffect } from 'react';

import { usePlaybackOptions } from './usePlaybackOptions';

export function usePlaybackOptionsModal(open: boolean, onClose: () => void) {
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
