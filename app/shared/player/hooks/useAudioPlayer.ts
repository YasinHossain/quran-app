import { useEffect, useRef, useState, MutableRefObject } from 'react';

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
function buildPlay(
  audioRef: MutableRefObject<HTMLAudioElement | null>,
  onError?: (e: unknown) => void,
  setIsPlaying?: (v: boolean) => void
): () => void {
  return () => {
    const a = audioRef.current;
    if (!a) return;
    playAudioElement(a, onError);
    setIsPlaying?.(true);
  };
}

function buildPause(
  audioRef: MutableRefObject<HTMLAudioElement | null>,
  setIsPlaying?: (v: boolean) => void
): () => void {
  return () => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    setIsPlaying?.(false);
  };
}

function buildSeek(
  audioRef: MutableRefObject<HTMLAudioElement | null>,
  defaultDuration?: number,
  onTimeUpdate?: (t: number) => void
): (sec: number) => number {
  return (sec: number) => {
    const a = audioRef.current;
    if (!a) return 0;
    const max = a.duration || defaultDuration || 0;
    a.currentTime = Math.max(0, Math.min(max, sec));
    const t = a.currentTime || 0;
    onTimeUpdate?.(t);
    return t;
  };
}

function buildSetVolume(
  audioRef: MutableRefObject<HTMLAudioElement | null>
): (vol: number) => void {
  return (vol: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = vol;
  };
}

function buildSetPlaybackRate(
  audioRef: MutableRefObject<HTMLAudioElement | null>
): (rate: number) => void {
  return (rate: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.playbackRate = rate;
  };
}

export function useAudioPlayer(options: Options = {}): AudioPlayerReturn {
  const { src, defaultDuration, onTimeUpdate, onLoadedMetadata, onError } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = buildPlay(audioRef, onError, setIsPlaying);
  const pause = buildPause(audioRef, setIsPlaying);
  const seek = buildSeek(audioRef, defaultDuration, onTimeUpdate);
  const setVolume = buildSetVolume(audioRef);
  const setPlaybackRate = buildSetPlaybackRate(audioRef);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) playAudioElement(a, onError);
    else a.pause();
  }, [isPlaying, src, onError]);

  useAudioElementEvents({ audioRef, src, defaultDuration, onTimeUpdate, onLoadedMetadata });

  return { audioRef, isPlaying, play, pause, seek, setVolume, setPlaybackRate };
}
