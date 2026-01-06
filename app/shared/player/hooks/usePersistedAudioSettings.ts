import { useEffect, useState } from 'react';

import { DEFAULT_RECITER, useReciters } from '@/app/shared/player/hooks/useReciters';

import type { Reciter } from '@/app/shared/player/types';

interface UsePersistedAudioSettingsReturn {
  reciter: Reciter;
  setReciterId: (id: number) => void;
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  playbackRate: number;
  setPlaybackRate: React.Dispatch<React.SetStateAction<number>>;
}

const STORAGE_KEY_RECITER = 'reciterId';
const STORAGE_KEY_VOLUME = 'volume';
const STORAGE_KEY_PLAYBACK_RATE = 'playbackRate';

/**
 * Manages audio settings with localStorage persistence.
 * Loads settings on mount and writes updates when they change.
 */
export function usePersistedAudioSettings(): UsePersistedAudioSettingsReturn {
  const [reciterId, setReciterId] = useState<number>(DEFAULT_RECITER.id);
  const [volume, setVolume] = useState(0.9);
  const [playbackRate, setPlaybackRate] = useState(1);
  const { reciters } = useReciters();

  // Load persisted settings on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedId = localStorage.getItem(STORAGE_KEY_RECITER);
      if (storedId) {
        const parsed = Number.parseInt(storedId, 10);
        if (Number.isFinite(parsed) && parsed > 0) {
          setReciterId(parsed);
        }
      }

      const vol = loadNumberFromStorage(STORAGE_KEY_VOLUME, (n) => n >= 0 && n <= 1);
      if (vol !== null) setVolume(vol);

      const rate = loadNumberFromStorage(STORAGE_KEY_PLAYBACK_RATE, (n) => n > 0);
      if (rate !== null) setPlaybackRate(rate);
    } catch {
      // ignore corrupted localStorage entries
    }
  }, []);

  // Persist settings when they change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_RECITER, String(reciterId));
      localStorage.setItem(STORAGE_KEY_VOLUME, String(volume));
      localStorage.setItem(STORAGE_KEY_PLAYBACK_RATE, String(playbackRate));
    } catch {
      // ignore write errors
    }
  }, [reciterId, volume, playbackRate]);

  // Resolve reciter object from ID
  const reciter: Reciter =
    reciters.find((r) => r.id === reciterId) ?? { ...DEFAULT_RECITER, id: reciterId };

  return {
    reciter,
    setReciterId,
    volume,
    setVolume,
    playbackRate,
    setPlaybackRate,
  };
}

function loadNumberFromStorage(key: string, isValid: (n: number) => boolean): number | null {
  const raw = localStorage.getItem(key);
  if (raw === null) return null;
  const n = Number.parseFloat(raw);
  if (Number.isNaN(n) || !isValid(n)) {
    localStorage.removeItem(key);
    return null;
  }
  return n;
}
