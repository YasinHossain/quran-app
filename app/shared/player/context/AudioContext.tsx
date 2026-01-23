'use client';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

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
  setReciterId: (id: number) => void;
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  playbackRate: number;
  setPlaybackRate: React.Dispatch<React.SetStateAction<number>>;
  isPlayerVisible: boolean;
  playbackSessionId: number;
  openPlayer: () => void;
  closePlayer: () => void;
}

export const AudioContext = createContext<AudioContextType | undefined>(undefined);

function useAudioCoreState(): Omit<
  AudioContextType,
  'isPlayerVisible' | 'playbackSessionId' | 'openPlayer' | 'closePlayer'
> {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [activeVerse, setActiveVerse] = useState<Verse | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { repeatOptions, setRepeatOptions } = useRepeatState();
  const { reciter, setReciterId, volume, setVolume, playbackRate, setPlaybackRate } =
    usePersistedAudioSettings();
  return {
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
    setReciterId,
    volume,
    setVolume,
    playbackRate,
    setPlaybackRate,
  } as const;
}

function useAudioContextValue(): AudioContextType {
  const core = useAudioCoreState();
  const { isPlayerVisible, playbackSessionId, openPlayer, closePlayer } = usePlayerVisibility({
    audioRef: core.audioRef,
    setIsPlaying: core.setIsPlaying,
    setPlayingId: core.setPlayingId,
    setActiveVerse: core.setActiveVerse,
  });

  const { isPlaying, activeVerse, setPlayingId } = core;

  // Keep the playing id in sync with the active verse while playing.
  useEffect(() => {
    if (isPlaying && activeVerse) {
      setPlayingId(activeVerse.id);
      return;
    }
    if (!isPlaying) {
      setPlayingId(null);
    }
  }, [isPlaying, activeVerse, setPlayingId]);

  // Prevent accidental OS copy/translate UI when tapping word-by-word while the player is active.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const shouldLock = isPlayerVisible && isPlaying;
    if (shouldLock) {
      root.dataset['audioSelectionLock'] = 'true';
    } else {
      delete root.dataset['audioSelectionLock'];
    }

    return () => {
      delete root.dataset['audioSelectionLock'];
    };
  }, [isPlayerVisible, isPlaying]);

  // memoize the full context value including controls
  return useMemo(
    () => ({ ...core, isPlayerVisible, playbackSessionId, openPlayer, closePlayer }),
    [core, isPlayerVisible, playbackSessionId, openPlayer, closePlayer]
  );
}

export const AudioProvider = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  const value = useAudioContextValue();
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
