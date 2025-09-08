import { buildPlayerLayoutProps } from '@/app/shared/player/utils/buildPlayerLayoutProps';

import type { usePlayerControls } from './usePlayerControls';
import type { useTrackTiming } from './useTrackTiming';
import type { Dispatch, SetStateAction } from 'react';

interface Options {
  timing: ReturnType<typeof useTrackTiming>;
  isPlaying: boolean;
  onNext?: () => boolean;
  onPrev?: () => boolean;
  closePlayer: () => void;
  setMobileOptionsOpen: Dispatch<SetStateAction<boolean>>;
  controls: ReturnType<typeof usePlayerControls>;
}

export function usePlayerLayout(options: Options) {
  return buildPlayerLayoutProps(options);
}
