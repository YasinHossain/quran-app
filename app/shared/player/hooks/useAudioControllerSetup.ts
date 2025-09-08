import { usePlaybackCompletion } from './usePlaybackCompletion';
import { usePlayerControls } from './usePlayerControls';

import type { useTrackTiming } from './useTrackTiming';
import type { RepeatOptions } from '@/app/shared/player/types';
import type { Verse } from '@/types';
import type { Dispatch, SetStateAction } from 'react';

interface Options {
  timing: ReturnType<typeof useTrackTiming>;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  setPlayingId: Dispatch<SetStateAction<number | null>>;
  activeVerse: Verse | null;
  setVolume: Dispatch<SetStateAction<number>>;
  repeatOptions: RepeatOptions;
  onNext?: () => boolean;
  onPrev?: () => boolean;
}

export function useAudioControllerSetup({
  timing,
  isPlaying,
  setIsPlaying,
  setPlayingId,
  activeVerse,
  setVolume,
  repeatOptions,
  onNext,
  onPrev,
}: Options) {
  const controls = usePlayerControls({
    interactable: timing.interactable,
    isPlaying,
    setIsPlaying,
    setPlayingId,
    activeVerse,
    current: timing.current,
    duration: timing.duration,
    seek: timing.seek,
    setVolume,
    play: timing.play,
    pause: timing.pause,
  });

  const handleEnded = usePlaybackCompletion({
    audioRef: timing.audioRef,
    repeatOptions,
    activeVerse,
    onNext,
    onPrev,
    seek: timing.seek,
    play: timing.play,
    pause: timing.pause,
    setIsPlaying,
    setPlayingId,
  });

  return { controls, handleEnded } as const;
}
