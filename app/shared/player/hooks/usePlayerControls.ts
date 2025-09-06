import { useCallback, useEffect } from 'react';
import { usePlayerKeyboard } from './usePlayerKeyboard';
import type { Verse } from '@/types';

interface Opts {
  interactable: boolean;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  setPlayingId: (v: number | null) => void;
  activeVerse: Verse | null;
  current: number;
  duration: number;
  seek: (s: number) => void;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  play: () => void;
  pause: () => void;
}

export function usePlayerControls({
  interactable,
  isPlaying,
  setIsPlaying,
  setPlayingId,
  activeVerse,
  current,
  duration,
  seek,
  setVolume,
  play,
  pause,
}: Opts) {
  useEffect(() => {
    if (isPlaying) play();
    else pause();
  }, [isPlaying, play, pause]);

  const togglePlay = useCallback(() => {
    if (!interactable) return;
    const next = !isPlaying;
    setIsPlaying(next);
    setPlayingId(next && activeVerse ? activeVerse.id : null);
  }, [interactable, isPlaying, setIsPlaying, setPlayingId, activeVerse]);

  const setSeek = useCallback((s: number) => seek(s), [seek]);

  usePlayerKeyboard({ current, duration, setSeek, togglePlay, setVolume });

  return { togglePlay, setSeek } as const;
}
