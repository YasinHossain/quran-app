import { RefObject } from 'react';

import { useAudioControllerCore } from './useAudioControllerCore';
import { usePlayerLayout } from './usePlayerLayout';
import { usePlayerOptionsState } from './usePlayerOptionsState';

import type { Track } from '@/app/shared/player/types';

interface Props {
  track?: Track | null;
  onPrev?: () => boolean;
  onNext?: () => boolean;
}

export function useQuranAudioController({ track, onPrev, onNext }: Props) {
  const options = usePlayerOptionsState();
  const core = useAudioControllerCore({ track, onPrev, onNext });
  const playerLayoutProps = usePlayerLayout({
    timing: core.timing,
    isPlaying: core.isPlaying,
    onNext,
    onPrev,
    closePlayer: core.closePlayer,
    setMobileOptionsOpen: options.setMobileOptionsOpen,
    controls: core.controls,
  });
  return {
    isPlayerVisible: core.isPlayerVisible,
    audioRef: core.audioRef as RefObject<HTMLAudioElement>,
    handleEnded: core.handleEnded,
    playerLayoutProps,
    ...options,
  } as const;
}
