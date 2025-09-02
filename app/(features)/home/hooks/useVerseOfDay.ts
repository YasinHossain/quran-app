'use client';

import { useEffect, useState, useCallback } from 'react';
import useSWR from 'swr';
import { Verse } from '@/types';
import { getSurahList } from '@/lib/api';
import { useSettings } from '@/app/providers/SettingsContext';
import { useRandomVerse } from './useRandomVerse';
import { useFallbackVerse } from './useFallbackVerse';
import { useVerseRotation } from './useVerseRotation';
import type { Surah } from '@/types';

interface UseVerseOfDayReturn {
  verse: Verse | null;
  loading: boolean;
  error: string | null;
  surahs: Surah[];
  refreshVerse: () => void;
  prefetchNextVerse: () => void;
}

/**
 * Main hook for managing verse of the day functionality
 * Composes smaller hooks for random verses, fallback verses, and rotation
 */
export function useVerseOfDay(): UseVerseOfDayReturn {
  const { settings } = useSettings();
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);

  // Random verse hook with error handling
  const randomVerse = useRandomVerse({
    translationId: settings.translationId,
    onError: () => console.warn('Random verse API unavailable, using fallback'),
  });

  // Fallback verse hook for when random API fails
  const fallbackVerse = useFallbackVerse({
    translationId: settings.translationId,
  });

  // Load surahs using SWR
  const { data: surahs = [] } = useSWR('surahs', getSurahList);

  // Determine which verse source to use
  const activeVerse = randomVerse.isAvailable ? randomVerse.verse : fallbackVerse.verse;
  const isLoading = randomVerse.isAvailable ? randomVerse.loading : fallbackVerse.loading;
  const currentError = randomVerse.error || fallbackVerse.error;

  // Update current verse when active verse changes
  useEffect(() => {
    if (activeVerse) {
      setCurrentVerse(activeVerse);
    }
  }, [activeVerse]);

  // Handle verse rotation
  const handleRotation = useCallback(() => {
    if (randomVerse.isAvailable && Math.random() < 0.3) {
      // 30% chance to fetch new random verse
      randomVerse.refresh();
    } else {
      // Use fallback rotation
      fallbackVerse.nextVerse();
    }
  }, [randomVerse, fallbackVerse]);

  // Set up auto-rotation
  useVerseRotation({
    interval: 10000,
    onRotate: handleRotation,
    enabled: Boolean(currentVerse),
  });

  // Refresh function
  const refreshVerse = useCallback(() => {
    if (randomVerse.isAvailable) {
      randomVerse.refresh();
    } else {
      fallbackVerse.nextVerse();
    }
  }, [randomVerse, fallbackVerse]);

  // Prefetch next verse
  const prefetchNextVerse = useCallback(() => {
    refreshVerse();
  }, [refreshVerse]);

  return {
    verse: currentVerse,
    loading: isLoading,
    error: currentError,
    surahs,
    refreshVerse,
    prefetchNextVerse,
  };
}
