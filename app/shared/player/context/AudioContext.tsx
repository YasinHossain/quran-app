'use client';
import React, { createContext, useContext, useMemo, useRef, useState } from 'react';

import { usePersistedAudioSettings } from '@/app/shared/player/hooks/usePersistedAudioSettings';
import { usePlayerVisibility } from '@/app/shared/player/hooks/usePlayerVisibility';
import { useRepeatState } from '@/app/shared/player/utils/repeatState';
import { Verse } from '@/types';

import type { Reciter, RepeatOptions } from '@/app/shared/player/types';

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
export const AudioProvider = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [activeVerse, setActiveVerse] = useState<Verse | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { repeatOptions, setRepeatOptions } = useRepeatState();
  const { reciter, setReciter, volume, setVolume, playbackRate, setPlaybackRate } =
    usePersistedAudioSettings();

  const { isPlayerVisible, openPlayer, closePlayer } = usePlayerVisibility({
    audioRef,
    setIsPlaying,
    setPlayingId,
    setActiveVerse,
  });

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
      setPlayingId,
      isPlaying,
      setIsPlaying,
      loadingId,
      setLoadingId,
      activeVerse,
      setActiveVerse,
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
    ]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

/**
 * Hook for accessing audio playback state.
 * Use within components to read or update the current playing or
 * loading audio identifiers managed by `AudioProvider`.
 */
export const useAudio = (): AudioContextType => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
};
