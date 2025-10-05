import { useAudio } from '@/app/shared/player/context/AudioContext';

import { useAudioControllerSetup } from './useAudioControllerSetup';
import { useTrackTiming } from './useTrackTiming';

import type { Track } from '@/app/shared/player/types';

interface Options {
  track?: Track | null;
  onPrev?: () => boolean;
  onNext?: () => boolean;
}

type CoreReturn = ReturnType<typeof useTrackTiming> &
  ReturnType<typeof useAudioControllerSetup> & {
    timing: ReturnType<typeof useTrackTiming>;
    isPlayerVisible: boolean;
    closePlayer: () => void;
    audioRef: React.MutableRefObject<HTMLAudioElement | null>;
    isPlaying: boolean;
  };

function useCoreDeps(
  track?: Track | null,
  onPrev?: () => boolean,
  onNext?: () => boolean
): {
  audio: ReturnType<typeof useAudio>;
  timing: ReturnType<typeof useTrackTiming>;
  setup: ReturnType<typeof useAudioControllerSetup>;
} {
  const audio = useAudio();
  const timing = useTrackTiming({
    ...(track !== undefined ? { track } : {}),
    volume: audio.volume,
    playbackRate: audio.playbackRate,
    contextRef: audio.audioRef,
  });
  const setup = useAudioControllerSetup({
    timing,
    isPlaying: audio.isPlaying,
    setIsPlaying: audio.setIsPlaying,
    setPlayingId: audio.setPlayingId,
    activeVerse: audio.activeVerse,
    setVolume: audio.setVolume,
    repeatOptions: audio.repeatOptions,
    ...(onNext ? { onNext } : {}),
    ...(onPrev ? { onPrev } : {}),
  });
  return { audio, timing, setup } as const;
}

export function useAudioControllerCore({ track, onPrev, onNext }: Options): CoreReturn {
  const { audio, timing, setup } = useCoreDeps(track, onPrev, onNext);
  return {
    isPlayerVisible: audio.isPlayerVisible,
    closePlayer: audio.closePlayer,
    isPlaying: audio.isPlaying,
    timing,
    ...timing,
    ...setup,
  } as const;
}
