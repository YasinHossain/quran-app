'use client';
import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import { Verse } from '@/types';
import { RECITERS, Reciter } from '@/lib/reciters';

// This is from the new AudioPlayer component.
export type RepeatOptions = {
  mode: 'off' | 'single' | 'range' | 'surah';
  start?: number;
  end?: number;
  playCount?: number;
  repeatEach?: number;
  delay?: number;
};

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
    mode: 'single',
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

  const closePlayer = () => {
    setIsPlaying(false);
    setPlayingId(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayerVisible(false);
  };

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
