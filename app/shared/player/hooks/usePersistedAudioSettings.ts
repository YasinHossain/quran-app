import { useEffect, useState } from 'react';

import { RECITERS } from '@/lib/audio/reciters';

import type { Reciter } from '@/app/shared/player/types';

interface UsePersistedAudioSettingsReturn {
  reciter: Reciter;
  setReciter: React.Dispatch<React.SetStateAction<Reciter>>;
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  playbackRate: number;
  setPlaybackRate: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Manages audio settings with localStorage persistence.
 * Loads settings on mount and writes updates when they change.
 */
export function usePersistedAudioSettings(): UsePersistedAudioSettingsReturn {
  const [reciter, setReciter] = useState<Reciter>(RECITERS[0]!);
  const [volume, setVolume] = useState(0.9);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Load persisted settings on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const found = loadReciterFromStorage();
      if (found) setReciter(found);

      const vol = loadNumberFromStorage('volume', (n) => n >= 0 && n <= 1);
      if (vol !== null) setVolume(vol);

      const rate = loadNumberFromStorage('playbackRate', (n) => n > 0);
      if (rate !== null) setPlaybackRate(rate);
    } catch {
      // ignore corrupted localStorage entries
    }
  }, []);

  // Persist settings when they change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('reciterId', String(reciter.id));
      localStorage.setItem('volume', String(volume));
      localStorage.setItem('playbackRate', String(playbackRate));
    } catch {
      // ignore write errors
    }
  }, [reciter.id, volume, playbackRate]);

  return { reciter, setReciter, volume, setVolume, playbackRate, setPlaybackRate };
}

function loadReciterFromStorage(): Reciter | null {
  const reciterId = localStorage.getItem('reciterId');
  if (!reciterId) return null;
  const parsed = Number.parseInt(reciterId, 10);
  const found = RECITERS.find((r) => r.id === parsed) ?? null;
  if (!found) localStorage.removeItem('reciterId');
  return found;
}

function loadNumberFromStorage(
  key: 'volume' | 'playbackRate',
  isValid: (n: number) => boolean
): number | null {
  const raw = localStorage.getItem(key);
  if (raw === null) return null;
  const n = Number.parseFloat(raw);
  if (Number.isNaN(n) || !isValid(n)) {
    localStorage.removeItem(key);
    return null;
  }
  return n;
}
