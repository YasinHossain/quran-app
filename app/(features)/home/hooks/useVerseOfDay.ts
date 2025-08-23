'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Verse } from '@/types';
import { getRandomVerse, getSurahList } from '@/lib/api';
import { useSettings } from '@/app/providers/SettingsContext';
import type { Surah } from '@/types';

interface UseVerseOfDayReturn {
  verse: Verse | null;
  loading: boolean;
  error: string | null;
  surahs: Surah[];
  refreshVerse: () => void;
  prefetchNextVerse: () => void;
}

export function useVerseOfDay(): UseVerseOfDayReturn {
  const { settings } = useSettings();
  const [verse, setVerse] = useState<Verse | null>(null);
  const [verseQueue, setVerseQueue] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [surahs, setSurahs] = useState<Surah[]>([]);

  const abortRef = useRef(false);

  // Preload a random verse and queue it for display
  const prefetchVerse = useCallback(async () => {
    try {
      const v = await getRandomVerse(settings.translationId);
      if (abortRef.current) return;
      setVerseQueue((q) => [...q, v]);
    } catch (err) {
      console.error('Error prefetching verse:', err);
    }
  }, [settings.translationId]);

  // Load the next verse from queue or fetch a new one
  const loadNextVerse = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let nextVerse: Verse;

      if (verseQueue.length > 0) {
        // Use verse from queue
        nextVerse = verseQueue[0];
        setVerseQueue((q) => q.slice(1));
      } else {
        // Fetch new verse directly
        nextVerse = await getRandomVerse(settings.translationId);
      }

      if (!abortRef.current) {
        setVerse(nextVerse);

        // Preload next verse for smooth experience
        prefetchVerse();
      }
    } catch (err) {
      if (!abortRef.current) {
        console.error('Error loading verse:', err);
        setError('Failed to load verse. Please try again.');
      }
    } finally {
      if (!abortRef.current) {
        setLoading(false);
      }
    }
  }, [verseQueue, settings.translationId, prefetchVerse]);

  // Refresh current verse (load new one)
  const refreshVerse = useCallback(() => {
    loadNextVerse();
  }, [loadNextVerse]);

  // Prefetch next verse for queue
  const prefetchNextVerse = useCallback(() => {
    prefetchVerse();
  }, [prefetchVerse]);

  // Load initial verse on mount or when translation changes
  useEffect(() => {
    abortRef.current = false;
    loadNextVerse();

    return () => {
      abortRef.current = true;
    };
  }, [settings.translationId, loadNextVerse]);

  // Load surahs list for metadata
  useEffect(() => {
    let isMounted = true;

    const loadSurahs = async () => {
      try {
        const surahsList = await getSurahList();
        if (isMounted) {
          setSurahs(surahsList);
        }
      } catch (err) {
        console.error('Error loading surahs:', err);
      }
    };

    loadSurahs();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    verse,
    loading,
    error,
    surahs,
    refreshVerse,
    prefetchNextVerse,
  };
}
