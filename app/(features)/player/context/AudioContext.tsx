'use client';
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Verse } from '@/types';
import { RECITERS } from '@/lib/audio/reciters';
import type { Reciter, RepeatOptions } from '@/app/(features)/player/types';

interface AudioContextType {
  playingId: number | null;
  setPlayingId: React.Dispatch<React.SetStateAction<number | null>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  loadingId: number | null;
  setLoadingId: React.Dispatch<React.SetStateAction<number | null>>;
  activeVerse: Verse | null;
  setActiveVerse: React.Dispatch<React.SetStateAction<Verse | null>>;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  repeatOptions: RepeatOptions;
  setRepeatOptions: React.Dispatch<React.SetStateAction<RepeatOptions>>;
  reciter: Reciter;
  setReciter: React.Dispatch<React.SetStateAction<Reciter>>;
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  playbackRate: number;
  setPlaybackRate: React.Dispatch<React.SetStateAction<number>>;
  isPlayerVisible: boolean;
  openPlayer: () => void;
  closePlayer: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

/**
 * Provides global audio playback state.
 * Wrap your application with this provider to share the currently
 * playing and loading audio identifiers across components.
 */
export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [activeVerse, setActiveVerse] = useState<Verse | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [repeatOptions, setRepeatOptions] = useState<RepeatOptions>({
    mode: 'off',
    start: 1,
    end: 1,
    playCount: 1,
    repeatEach: 1,
    delay: 0,
  });
  const [reciter, setReciter] = useState<Reciter>(RECITERS[0]);
  const [volume, setVolume] = useState(0.9);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isPlayerVisible, setPlayerVisible] = useState(true);

  const openPlayer = useCallback(() => {
    setPlayerVisible(true);
  }, [setPlayerVisible]);

  const closePlayer = useCallback(() => {
    setIsPlaying(false);
    setPlayingId(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayerVisible(false);
  }, [setIsPlaying, setPlayingId, audioRef, setPlayerVisible]);

  const value = useMemo(
    () => ({
      playingId,
      setPlayingId,
      isPlaying,
      setIsPlaying,
      loadingId,
      setLoadingId,
      activeVerse,
      setActiveVerse,
      audioRef,
      repeatOptions,
      setRepeatOptions,
      reciter,
      setReciter,
      volume,
      setVolume,
      playbackRate,
      setPlaybackRate,
      isPlayerVisible,
      openPlayer,
      closePlayer,
    }),
    [
      playingId,
      isPlaying,
      loadingId,
      activeVerse,
      repeatOptions,
      reciter,
      volume,
      playbackRate,
      isPlayerVisible,
      openPlayer,
      closePlayer,
    ]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

/**
 * Hook for accessing audio playback state.
 * Use within components to read or update the current playing or
 * loading audio identifiers managed by `AudioProvider`.
 */
export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
};
