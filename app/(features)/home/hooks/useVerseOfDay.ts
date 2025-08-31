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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const abortRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const prefetchingRef = useRef(false);
  const initializingRef = useRef(false);

  // Initialize verse cache with 5 verses
  const initializeVerseCache = useCallback(async () => {
    if (initializingRef.current || isInitialized) return;
    initializingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const verses: Verse[] = [];

      // Fetch 5 verses in parallel for initial cache
      const fetchPromises = Array.from({ length: 5 }, () => getRandomVerse(settings.translationId));

      const fetchedVerses = await Promise.all(fetchPromises);
      verses.push(...fetchedVerses);

      if (!abortRef.current) {
        setVerseQueue(verses);
        setVerse(verses[0]);
        setCurrentIndex(0);
        setIsInitialized(true);
        setLoading(false);
      }
    } catch (err) {
      if (!abortRef.current) {
        console.error('Error initializing verse cache:', err);
        setError('Unable to load verse. Using offline content.');
        setLoading(false);
      }
    } finally {
      initializingRef.current = false;
    }
  }, [settings.translationId, isInitialized]);

  // Use refs to avoid dependency issues
  const verseQueueRef = useRef<Verse[]>([]);
  const currentIndexRef = useRef(0);

  // Update refs when state changes
  useEffect(() => {
    verseQueueRef.current = verseQueue;
  }, [verseQueue]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Rotate to next verse in cache
  const rotateToNextVerse = useCallback(() => {
    const queue = verseQueueRef.current;
    if (queue.length === 0) return;

    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % queue.length;
      setVerse(queue[nextIndex]);
      return nextIndex;
    });
  }, []);

  // Refresh cache with new verses
  const refreshCache = useCallback(async () => {
    if (prefetchingRef.current) return;
    prefetchingRef.current = true;

    try {
      const newVerses: Verse[] = [];

      // Fetch 5 new verses
      const fetchPromises = Array.from({ length: 5 }, () => getRandomVerse(settings.translationId));

      const fetchedVerses = await Promise.all(fetchPromises);
      newVerses.push(...fetchedVerses);

      if (!abortRef.current) {
        setVerseQueue(newVerses);
        setVerse(newVerses[0]);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error('Error refreshing verse cache:', err);
    } finally {
      prefetchingRef.current = false;
    }
  }, [settings.translationId]);

  // Start automatic rotation every 10 seconds
  const startAutoRotation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (!abortRef.current) {
        rotateToNextVerse();
      }
    }, 10000); // 10 seconds
  }, [rotateToNextVerse]);

  // Stop automatic rotation
  const stopAutoRotation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  // Refresh verse (reload entire cache)
  const refreshVerse = useCallback(() => {
    refreshCache();
  }, [refreshCache]);

  // Prefetch next verse (refresh cache when needed)
  const prefetchNextVerse = useCallback(() => {
    refreshCache();
  }, [refreshCache]);

  // Initialize on mount and translation change
  useEffect(() => {
    abortRef.current = false;
    setIsInitialized(false);
    stopAutoRotation(); // Stop any existing rotation
    initializeVerseCache();

    return () => {
      abortRef.current = true;
      stopAutoRotation();
    };
  }, [settings.translationId]);

  // Start rotation when cache is ready
  useEffect(() => {
    if (isInitialized && verseQueue.length > 0 && !intervalRef.current) {
      // Start interval directly to avoid dependency issues
      intervalRef.current = setInterval(() => {
        if (!abortRef.current) {
          rotateToNextVerse();
        }
      }, 10000); // 10 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [isInitialized, verseQueue.length]);

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
