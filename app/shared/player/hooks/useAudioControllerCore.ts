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
    isPlayerVisible: boolean;
    closePlayer: () => void;
    audioRef: React.RefObject<HTMLAudioElement>;
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
    track,
    volume: audio.volume,
    playbackRate: audio.playbackRate,
    contextRef: audio.audioRef,
  });
  const setup = useAudioControllerSetup({
    timing,
    isPlaying: audio.isPlaying,
    setIsPlaying: audio.setIsPlaying,
    setPlayingId: audio.setPlayingId as unknown as React.Dispatch<
      React.SetStateAction<string | null>
    >, // keep existing external type expectations
    activeVerse: audio.activeVerse,
    setVolume: audio.setVolume,
    repeatOptions: audio.repeatOptions,
    onNext,
    onPrev,
  });
  return { audio, timing, setup } as const;
}

export function useAudioControllerCore({ track, onPrev, onNext }: Options): CoreReturn {
  const { audio, timing, setup } = useCoreDeps(track, onPrev, onNext);
  return {
    isPlayerVisible: audio.isPlayerVisible,
    closePlayer: audio.closePlayer,
    audioRef: audio.audioRef,
    isPlaying: audio.isPlaying,
    ...timing,
    ...setup,
  } as const;
}
