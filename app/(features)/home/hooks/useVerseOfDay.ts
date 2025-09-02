'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import useSWR from 'swr';
import { Verse } from '@/types';
import { getRandomVerse, getSurahList, getVerseByKey } from '@/lib/api';
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

// Curated verses that always work as fallback
const FALLBACK_VERSE_KEYS = [
  '2:255', // Ayat al-Kursi
  '1:1', // Al-Fatihah opening
  '1:2', // Al-Fatihah verse 2
  '1:3', // Al-Fatihah verse 3
  '1:4', // Al-Fatihah verse 4
  '1:5', // Al-Fatihah verse 5
  '1:6', // Al-Fatihah verse 6
  '1:7', // Al-Fatihah verse 7
  '2:1', // Al-Baqarah opening
  '2:2', // Al-Baqarah verse 2
  '3:1', // Al Imran opening
  '3:2', // Al Imran verse 2
  '112:1', // Al-Ikhlas opening
  '112:2', // Al-Ikhlas verse 2
  '112:3', // Al-Ikhlas verse 3
  '112:4', // Al-Ikhlas verse 4
  '113:1', // Al-Falaq opening
  '114:1', // An-Nas opening
  '36:1', // Ya-Sin opening
  '67:1', // Al-Mulk opening
];

export function useVerseOfDay(): UseVerseOfDayReturn {
  const { settings } = useSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [useRandomAPI, setUseRandomAPI] = useState(true);
  const [verse, setVerse] = useState<Verse | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | undefined>();

  // Try to fetch a random verse, but fallback gracefully
  const randomVerseFetcher = useCallback(async (): Promise<Verse> => {
    try {
      return await getRandomVerse(settings.translationId);
    } catch (error) {
      console.warn('Random verse API failed, switching to fallback mode:', error);
      setUseRandomAPI(false);
      throw error;
    }
  }, [settings.translationId]);

  // Fallback verse fetcher using curated verse keys
  const fallbackVerseFetcher = useCallback(async (): Promise<Verse> => {
    const verseKey = FALLBACK_VERSE_KEYS[currentIndex % FALLBACK_VERSE_KEYS.length];
    return await getVerseByKey(verseKey, settings.translationId);
  }, [settings.translationId, currentIndex]);

  // Use SWR for random verses (with error handling)
  const {
    data: randomVerse,
    error: randomError,
    mutate: mutateRandom,
  } = useSWR(useRandomAPI ? ['random-verse', settings.translationId] : null, randomVerseFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
    dedupingInterval: 30000, // Don't refetch for 30 seconds
  });

  // Use SWR for fallback verses
  const {
    data: fallbackVerse,
    error: fallbackError,
    mutate: mutateFallback,
  } = useSWR(
    !useRandomAPI ? ['fallback-verse', settings.translationId, currentIndex] : null,
    fallbackVerseFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Load surahs using SWR
  const { data: surahs = [] } = useSWR('surahs', getSurahList);

  // Determine current verse and loading state
  const currentVerse = randomVerse || fallbackVerse;
  const isLoading = useRandomAPI ? !randomVerse && !randomError : !fallbackVerse && !fallbackError;
  const currentError =
    randomError && fallbackError ? 'Unable to load verses. Please check your connection.' : null;

  // Set the active verse when data changes
  useEffect(() => {
    if (currentVerse) {
      setVerse(currentVerse);
    }
  }, [currentVerse]);

  // Auto-rotate verses every 10 seconds
  useEffect(() => {
    if (!currentVerse) return;

    const startRotation = () => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const nextIndex = (prev + 1) % FALLBACK_VERSE_KEYS.length;

          // If using random API, try to fetch a new random verse periodically
          if (useRandomAPI && Math.random() < 0.3) {
            // 30% chance to try random
            mutateRandom();
          } else if (!useRandomAPI) {
            // In fallback mode, trigger refetch with new index
            mutateFallback();
          }

          return nextIndex;
        });
      }, 10000);
    };

    startRotation();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentVerse, useRandomAPI, mutateRandom, mutateFallback]);

  // Refresh function - try random API first, fallback if needed
  const refreshVerse = useCallback(() => {
    if (useRandomAPI) {
      mutateRandom();
    } else {
      // Try to re-enable random API periodically
      if (Math.random() < 0.5) {
        // 50% chance to retry random API
        setUseRandomAPI(true);
        mutateRandom();
      } else {
        setCurrentIndex((prev) => (prev + 1) % FALLBACK_VERSE_KEYS.length);
        mutateFallback();
      }
    }
  }, [useRandomAPI, mutateRandom, mutateFallback]);

  // Prefetch next verse
  const prefetchNextVerse = useCallback(() => {
    refreshVerse();
  }, [refreshVerse]);

  return {
    verse,
    loading: isLoading,
    error: currentError,
    surahs,
    refreshVerse,
    prefetchNextVerse,
  };
}
