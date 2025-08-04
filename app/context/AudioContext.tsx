'use client';
import React, { createContext, useContext, useMemo, useState } from 'react';

interface AudioContextType {
  playingId: number | null;
  setPlayingId: React.Dispatch<React.SetStateAction<number | null>>;
  loadingId: number | null;
  setLoadingId: React.Dispatch<React.SetStateAction<number | null>>;
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

  const value = useMemo(
    () => ({ playingId, setPlayingId, loadingId, setLoadingId }),
    [playingId, setPlayingId, loadingId, setLoadingId]
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
