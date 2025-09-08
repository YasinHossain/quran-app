import type { usePlayerControls } from '@/app/shared/player/hooks/usePlayerControls';
import type { useTrackTiming } from '@/app/shared/player/hooks/useTrackTiming';
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

export function buildPlayerLayoutProps({
  timing,
  isPlaying,
  onNext,
  onPrev,
  closePlayer,
  setMobileOptionsOpen,
  controls,
}: Options): {
  cover: ReturnType<typeof useTrackTiming>['cover'];
  title: ReturnType<typeof useTrackTiming>['title'];
  artist: ReturnType<typeof useTrackTiming>['artist'];
  current: ReturnType<typeof useTrackTiming>['current'];
  duration: ReturnType<typeof useTrackTiming>['duration'];
  elapsed: ReturnType<typeof useTrackTiming>['elapsed'];
  total: ReturnType<typeof useTrackTiming>['total'];
  interactable: ReturnType<typeof useTrackTiming>['interactable'];
  isPlaying: boolean;
  togglePlay: ReturnType<typeof usePlayerControls>['togglePlay'];
  setSeek: ReturnType<typeof usePlayerControls>['setSeek'];
  onNext?: () => boolean;
  onPrev?: () => boolean;
  closePlayer: () => void;
  setMobileOptionsOpen: () => void;
} {
  return {
    cover: timing.cover,
    title: timing.title,
    artist: timing.artist,
    current: timing.current,
    duration: timing.duration,
    elapsed: timing.elapsed,
    total: timing.total,
    interactable: timing.interactable,
    isPlaying,
    togglePlay: controls.togglePlay,
    setSeek: controls.setSeek,
    onNext,
    onPrev,
    closePlayer,
    setMobileOptionsOpen: () => setMobileOptionsOpen(true),
  } as const;
}
