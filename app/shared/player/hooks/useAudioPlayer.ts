import { useCallback, useEffect, useRef, useState, MutableRefObject } from 'react';

import { playAudioElement } from './playAudioElement';
import { useAudioElementEvents } from './useAudioElementEvents';

type Options = {
  src?: string;
  defaultDuration?: number;
  onTimeUpdate?: (time: number) => void;
  onLoadedMetadata?: (duration: number) => void;
  onError?: (error: unknown) => void;
};

interface AudioPlayerReturn {
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  seek: (sec: number) => number;
  setVolume: (vol: number) => void;
  setPlaybackRate: (rate: number) => void;
}

/**
 * Controls an `HTMLAudioElement` and exposes playback helpers.
 *
 * @param options optional callbacks and src.
 * @returns helpers and state for audio playback.
 */
export function useAudioPlayer(options: Options = {}): AudioPlayerReturn {
  const { src, defaultDuration, onTimeUpdate, onLoadedMetadata, onError } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    playAudioElement(a, onError);
    setIsPlaying(true);
  }, [onError]);

  const pause = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    setIsPlaying(false);
  }, []);

  const seek = useCallback(
    (sec: number) => {
      const a = audioRef.current;
      if (!a) return 0;
      const max = a.duration || defaultDuration || 0;
      a.currentTime = Math.max(0, Math.min(max, sec));
      const t = a.currentTime || 0;
      onTimeUpdate?.(t);
      return t;
    },
    [defaultDuration, onTimeUpdate]
  );

  const setVolume = useCallback((vol: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = vol;
  }, []);

  const setPlaybackRate = useCallback((rate: number): void => {
    const a = audioRef.current;
    if (!a) return;
    a.playbackRate = rate;
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) {
      playAudioElement(a, onError);
    } else {
      a.pause();
    }
  }, [isPlaying, src, onError]);

  useAudioElementEvents({
    audioRef,
    src,
    defaultDuration,
    onTimeUpdate,
    onLoadedMetadata,
  });

  return { audioRef, isPlaying, play, pause, seek, setVolume, setPlaybackRate };
}
