import { useEffect, useState } from 'react';

import { RECITERS } from '@/lib/audio/reciters';

import type { Reciter } from '../types';

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
  const [reciter, setReciter] = useState<Reciter>(RECITERS[0]);
  const [volume, setVolume] = useState(0.9);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Load persisted settings on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const reciterId = localStorage.getItem('reciterId');
      if (reciterId) {
        const parsed = Number.parseInt(reciterId, 10);
        const found = RECITERS.find((r) => r.id === parsed);
        if (found) setReciter(found);
        else localStorage.removeItem('reciterId');
      }

      const storedVolume = localStorage.getItem('volume');
      if (storedVolume !== null) {
        const parsed = Number.parseFloat(storedVolume);
        if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 1) setVolume(parsed);
        else localStorage.removeItem('volume');
      }

      const storedRate = localStorage.getItem('playbackRate');
      if (storedRate !== null) {
        const parsed = Number.parseFloat(storedRate);
        if (!Number.isNaN(parsed) && parsed > 0) setPlaybackRate(parsed);
        else localStorage.removeItem('playbackRate');
      }
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

