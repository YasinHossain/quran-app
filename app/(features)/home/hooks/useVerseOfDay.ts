'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import useSWR from 'swr';
import { Verse } from '@/types';
import { getSurahList } from '@/lib/api';
import { useSettings } from '@/app/providers/SettingsContext';
import { useRandomVerse } from './useRandomVerse';
import { useFallbackVerse } from './useFallbackVerse';
import { useVerseRotation } from './useVerseRotation';
import type { Surah } from '@/types';
import { logger } from '@/src/infrastructure/monitoring/Logger';

interface UseVerseOfDayOptions {
  /**
   * Interval in milliseconds between each automatic rotation
   */
  rotationInterval?: number;
  /**
   * Number of rotations before fetching a new random verse
   */
  randomVerseInterval?: number;
}

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
export function useVerseOfDay({
  rotationInterval = 10000,
  randomVerseInterval = 3,
}: UseVerseOfDayOptions = {}): UseVerseOfDayReturn {
  const { settings } = useSettings();
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  const rotationCountRef = useRef(0);

  // Random verse hook with error handling
  const randomVerse = useRandomVerse({
    translationId: settings.translationId,
    onError: () => logger.warn('Random verse API unavailable, using fallback'),
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
    rotationCountRef.current += 1;

    if (randomVerse.isAvailable && rotationCountRef.current >= randomVerseInterval) {
      randomVerse.refresh();
      rotationCountRef.current = 0;
    } else {
      fallbackVerse.nextVerse();
    }
  }, [randomVerse, fallbackVerse, randomVerseInterval]);

  // Set up auto-rotation
  useVerseRotation({
    interval: rotationInterval,
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
