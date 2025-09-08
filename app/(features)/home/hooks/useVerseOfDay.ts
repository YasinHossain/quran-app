'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import useSWR from 'swr';

import { useSettings } from '@/app/providers/SettingsContext';
import { getSurahList } from '@/lib/api';
import { logger } from '@/src/infrastructure/monitoring/Logger';
import { Verse } from '@/types';

import { useFallbackVerse } from './useFallbackVerse';
import { useRandomVerse } from './useRandomVerse';
import { useVerseRotation } from './useVerseRotation';

import type { Surah } from '@/types';

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

// Custom hook for verse source management
interface UseVerseSourceOptions {
  translationId: number;
  randomVerseInterval: number;
  rotationCountRef: React.MutableRefObject<number>;
}

interface UseVerseSourceReturn {
  activeVerse: Verse | null;
  isLoading: boolean;
  currentError: string | null;
  handleRotation: () => void;
  refreshVerse: () => void;
}

const useVerseSource = ({
  translationId,
  randomVerseInterval,
  rotationCountRef,
}: UseVerseSourceOptions): UseVerseSourceReturn => {
  // Random verse hook with error handling
  const randomVerse = useRandomVerse({
    translationId,
    onError: () => logger.warn('Random verse API unavailable, using fallback'),
  });

  // Fallback verse hook for when random API fails
  const fallbackVerse = useFallbackVerse({
    translationId,
  });

  // Determine which verse source to use
  const activeVerse = randomVerse.isAvailable ? randomVerse.verse : fallbackVerse.verse;
  const isLoading = randomVerse.isAvailable ? randomVerse.loading : fallbackVerse.loading;
  const currentError = randomVerse.error || fallbackVerse.error;

  // Handle verse rotation
  const handleRotation = useCallback(() => {
    rotationCountRef.current += 1;

    if (randomVerse.isAvailable && rotationCountRef.current >= randomVerseInterval) {
      randomVerse.refresh();
      rotationCountRef.current = 0;
    } else {
      fallbackVerse.nextVerse();
    }
  }, [randomVerse, fallbackVerse, randomVerseInterval, rotationCountRef]);

  // Refresh function
  const refreshVerse = useCallback(() => {
    if (randomVerse.isAvailable) {
      randomVerse.refresh();
    } else {
      fallbackVerse.nextVerse();
    }
  }, [randomVerse, fallbackVerse]);

  return {
    activeVerse,
    isLoading,
    currentError,
    handleRotation,
    refreshVerse,
  };
};

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

  // Load surahs using SWR
  const { data: surahs = [] } = useSWR('surahs', getSurahList);

  // Manage verse sources
  const { activeVerse, isLoading, currentError, handleRotation, refreshVerse } = useVerseSource({
    translationId: settings.translationId,
    randomVerseInterval,
    rotationCountRef,
  });

  // Update current verse when active verse changes
  useEffect(() => {
    if (activeVerse) {
      setCurrentVerse(activeVerse);
    }
  }, [activeVerse]);

  // Set up auto-rotation
  useVerseRotation({
    interval: rotationInterval,
    onRotate: handleRotation,
    enabled: Boolean(currentVerse),
  });

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
