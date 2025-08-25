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
  const intervalRef = useRef<NodeJS.Timeout>();

  // Preload verses to maintain cache of 3-5 verses
  const prefetchVerse = useCallback(async () => {
    try {
      const v = await getRandomVerse(settings.translationId);
      if (abortRef.current) return;
      setVerseQueue((q) => {
        // Keep max 5 verses in queue
        const updatedQueue = [...q, v];
        return updatedQueue.length > 5 ? updatedQueue.slice(1) : updatedQueue;
      });
    } catch (err) {
      console.error('Error prefetching verse:', err);
    }
  }, [settings.translationId]);

  // Load the next verse from queue or fetch a new one
  const loadNextVerse = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
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

        // Maintain cache by prefetching more verses
        if (verseQueue.length < 3) {
          prefetchVerse();
        }
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

  // Start automatic rotation every 10 seconds
  const startAutoRotation = useCallback(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (!abortRef.current) {
        loadNextVerse(false); // Don't show loading spinner for auto-rotation
      }
    }, 10000); // 10 seconds
  }, [loadNextVerse]);

  // Stop automatic rotation
  const stopAutoRotation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  // Refresh current verse (load new one)
  const refreshVerse = useCallback(() => {
    loadNextVerse();
  }, [loadNextVerse]);

  // Prefetch next verse for queue
  const prefetchNextVerse = useCallback(() => {
    prefetchVerse();
  }, [prefetchVerse]);

  // Load initial verse and setup auto-rotation
  useEffect(() => {
    abortRef.current = false;
    
    // Load initial verse
    loadNextVerse().then(() => {
      // Start auto-rotation after initial load
      startAutoRotation();
      
      // Prefetch initial cache of verses
      for (let i = 0; i < 3; i++) {
        setTimeout(() => prefetchVerse(), i * 500); // Stagger requests
      }
    });

    return () => {
      abortRef.current = true;
      stopAutoRotation();
    };
  }, [settings.translationId, loadNextVerse, startAutoRotation, stopAutoRotation, prefetchVerse]);

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
