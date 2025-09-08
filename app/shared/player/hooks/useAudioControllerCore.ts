import { useAudio } from '@/app/shared/player/context/AudioContext';

import { useAudioControllerSetup } from './useAudioControllerSetup';
import { useTrackTiming } from './useTrackTiming';

import type { Track } from '@/app/shared/player/types';

interface Options {
  track?: Track | null;
  onPrev?: () => boolean;
  onNext?: () => boolean;
}

export function useAudioControllerCore({ track, onPrev, onNext }: Options) {
  const {
    isPlayerVisible,
    closePlayer,
    audioRef,
    isPlaying,
    setIsPlaying,
    setPlayingId,
    activeVerse,
    volume,
    setVolume,
    playbackRate,
    repeatOptions,
  } = useAudio();
  const timing = useTrackTiming({ track, volume, playbackRate, contextRef: audioRef });
  const { controls, handleEnded } = useAudioControllerSetup({
    timing,
    isPlaying,
    setIsPlaying,
    setPlayingId,
    activeVerse,
    setVolume,
    repeatOptions,
    onNext,
    onPrev,
  });
  return {
    isPlayerVisible,
    closePlayer,
    audioRef,
    timing,
    controls,
    handleEnded,
    isPlaying,
  } as const;
}
