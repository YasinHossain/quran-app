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
  const prefetchingRef = useRef(false);

  // Preload verses to maintain cache of exactly 3 verses
  const prefetchVerse = useCallback(async () => {
    if (prefetchingRef.current) return;
    prefetchingRef.current = true;

    try {
      const v = await getRandomVerse(settings.translationId);
      if (abortRef.current) return;

      setVerseQueue((q) => {
        // Keep exactly 3 verses in queue
        const updatedQueue = [...q, v];
        return updatedQueue.length > 3 ? updatedQueue.slice(-3) : updatedQueue;
      });
    } catch (err) {
      console.error('Error prefetching verse:', err);
    } finally {
      prefetchingRef.current = false;
    }
  }, [settings.translationId]);

  // Load the next verse from queue or fetch a new one
  const loadNextVerse = useCallback(
    async (showLoading = true) => {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);

      try {
        let nextVerse: Verse;

        if (verseQueue.length > 0) {
          // Use verse from queue (smooth transition)
          nextVerse = verseQueue[0];
          setVerseQueue((q) => {
            const newQueue = q.slice(1);
            // Immediately prefetch a new verse to maintain 3 in cache
            if (newQueue.length < 3) {
              setTimeout(() => prefetchVerse(), 100);
            }
            return newQueue;
          });
        } else {
          // Fallback: fetch new verse directly
          nextVerse = await getRandomVerse(settings.translationId);
          // Start building cache
          setTimeout(() => prefetchVerse(), 100);
        }

        if (!abortRef.current) {
          setVerse(nextVerse);
        }
      } catch (err) {
        if (!abortRef.current) {
          console.error('Error loading verse:', err);
          setError('Failed to load verse. Please try again.');
        }
      } finally {
        if (!abortRef.current && showLoading) {
          setLoading(false);
        }
      }
    },
    [verseQueue, settings.translationId, prefetchVerse]
  );

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

    const initializeVerse = async () => {
      // Load initial verse
      await loadNextVerse();

      // Build initial cache of 3 verses
      const prefetchPromises = [];
      for (let i = 0; i < 3; i++) {
        prefetchPromises.push(
          new Promise((resolve) => setTimeout(() => prefetchVerse().then(resolve), i * 200))
        );
      }

      // Wait for initial cache to build, then start rotation
      await Promise.all(prefetchPromises);

      if (!abortRef.current) {
        startAutoRotation();
      }
    };

    initializeVerse();

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
