import { useEffect, useMemo, useState } from 'react';

import { DEFAULT_RECITER } from '@/app/shared/player/hooks/useReciters';

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
const STORAGE_KEY_RECITER_META = 'reciterMeta';
const STORAGE_KEY_VOLUME = 'volume';
const STORAGE_KEY_PLAYBACK_RATE = 'playbackRate';

/**
 * Manages audio settings with localStorage persistence.
 * Loads settings on mount and writes updates when they change.
 */
export function usePersistedAudioSettings(): UsePersistedAudioSettingsReturn {
  const [reciterId, setReciterId] = useState<number>(DEFAULT_RECITER.id);
  const [reciterMeta, setReciterMeta] = useState<Reciter | null>(null);
  const [volume, setVolume] = useState(0.9);
  const [playbackRate, setPlaybackRate] = useState(1);

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

      const storedMeta = localStorage.getItem(STORAGE_KEY_RECITER_META);
      if (storedMeta) {
        const parsedMeta = JSON.parse(storedMeta) as unknown;
        if (
          parsedMeta &&
          typeof parsedMeta === 'object' &&
          'id' in parsedMeta &&
          typeof (parsedMeta as { id?: unknown }).id === 'number' &&
          'name' in parsedMeta &&
          typeof (parsedMeta as { name?: unknown }).name === 'string'
        ) {
          const meta = parsedMeta as Reciter;
          if (Number.isFinite(meta.id) && meta.id > 0 && meta.name.trim().length > 0) {
            setReciterMeta(meta);
          }
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedMeta = localStorage.getItem(STORAGE_KEY_RECITER_META);
      if (!storedMeta) {
        setReciterMeta(null);
        return;
      }
      const parsedMeta = JSON.parse(storedMeta) as unknown;
      if (
        parsedMeta &&
        typeof parsedMeta === 'object' &&
        'id' in parsedMeta &&
        typeof (parsedMeta as { id?: unknown }).id === 'number' &&
        'name' in parsedMeta &&
        typeof (parsedMeta as { name?: unknown }).name === 'string'
      ) {
        const meta = parsedMeta as Reciter;
        setReciterMeta(meta.id === reciterId ? meta : null);
      } else {
        setReciterMeta(null);
      }
    } catch {
      setReciterMeta(null);
    }
  }, [reciterId]);

  const reciter = useMemo<Reciter>(() => {
    if (reciterMeta && reciterMeta.id === reciterId) return reciterMeta;
    if (reciterId === DEFAULT_RECITER.id) return DEFAULT_RECITER;
    return { ...DEFAULT_RECITER, id: reciterId };
  }, [reciterId, reciterMeta]);

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
