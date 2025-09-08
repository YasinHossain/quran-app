import { RefObject } from 'react';

import { useAudioControllerCore } from './useAudioControllerCore';
import { useControllerLayout } from './useControllerLayout';
import { usePlayerOptionsState } from './usePlayerOptionsState';

import type { Track } from '@/app/shared/player/types';

interface Props {
  track?: Track | null;
  onPrev?: () => boolean;
  onNext?: () => boolean;
}

export interface UseQuranAudioControllerReturn extends ReturnType<typeof usePlayerOptionsState> {
  isPlayerVisible: boolean;
  audioRef: RefObject<HTMLAudioElement>;
  handleEnded: () => void;
  playerLayoutProps: ReturnType<typeof useControllerLayout>;
}

export function useQuranAudioController({
  track,
  onPrev,
  onNext,
}: Props): UseQuranAudioControllerReturn {
  const options = usePlayerOptionsState();
  const core = useAudioControllerCore({ track, onPrev, onNext });
  const playerLayoutProps = useControllerLayout({
    core,
    setMobileOptionsOpen: options.setMobileOptionsOpen,
    onNext,
    onPrev,
  });
  return {
    isPlayerVisible: core.isPlayerVisible,
    audioRef: core.audioRef as RefObject<HTMLAudioElement>,
    handleEnded: core.handleEnded,
    playerLayoutProps,
    ...options,
  };
}
