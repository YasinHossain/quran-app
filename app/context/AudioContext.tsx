'use client';
import React, { createContext, useContext, useState } from 'react';

interface AudioContextType {
  playingId: number | null;
  setPlayingId: React.Dispatch<React.SetStateAction<number | null>>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [playingId, setPlayingId] = useState<number | null>(null);

  return (
    <AudioContext.Provider value={{ playingId, setPlayingId }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
};
