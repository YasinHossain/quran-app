'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';
import { useSurahNavigationData } from '@/app/shared/navigation/hooks/useSurahNavigationData';
import { Verse } from '@/types';

import { useVerseRotation } from './useVerseRotation';
import { useVerseSource } from './useVerseSource';

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

  // Load surahs from the shared navigation dataset
  const { surahs } = useSurahNavigationData();

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

export { useVerseSource } from './useVerseSource';
