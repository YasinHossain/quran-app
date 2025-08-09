'use client';
import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import { Verse } from '@/types';
import { RECITERS, Reciter } from '@/lib/reciters';

interface AudioContextType {
  playingId: number | null;
  setPlayingId: React.Dispatch<React.SetStateAction<number | null>>;
  loadingId: number | null;
  setLoadingId: React.Dispatch<React.SetStateAction<number | null>>;
  activeVerse: Verse | null;
  setActiveVerse: React.Dispatch<React.SetStateAction<Verse | null>>;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  repeatSettings: RepeatSettings;
  setRepeatSettings: React.Dispatch<React.SetStateAction<RepeatSettings>>;
  reciter: Reciter;
  setReciter: React.Dispatch<React.SetStateAction<Reciter>>;
}

export interface RepeatSettings {
  mode: 'single' | 'range' | 'surah';
  start: number;
  end: number;
  playCount: number;
  repeatEach: number;
  delay: number;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

/**
 * Provides global audio playback state.
 * Wrap your application with this provider to share the currently
 * playing and loading audio identifiers across components.
 */
export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [activeVerse, setActiveVerse] = useState<Verse | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [repeatSettings, setRepeatSettings] = useState<RepeatSettings>({
    mode: 'single',
    start: 1,
    end: 1,
    playCount: 1,
    repeatEach: 1,
    delay: 0,
  });
  const [reciter, setReciter] = useState<Reciter>(RECITERS[0]);

  const value = useMemo(
    () => ({
      playingId,
      setPlayingId,
      loadingId,
      setLoadingId,
      activeVerse,
      setActiveVerse,
      audioRef,
      repeatSettings,
      setRepeatSettings,
      reciter,
      setReciter,
    }),
    [playingId, loadingId, activeVerse, repeatSettings, reciter]
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
