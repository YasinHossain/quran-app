'use client';

import { useCallback } from 'react';

import { logger } from '@/src/infrastructure/monitoring/Logger';
import { Verse } from '@/types';

import { useFallbackVerse } from './useFallbackVerse';
import { useRandomVerse } from './useRandomVerse';

import type { MutableRefObject } from 'react';

interface UseVerseSourceOptions {
  translationId: number;
  randomVerseInterval: number;
  rotationCountRef: MutableRefObject<number>;
}

interface UseVerseSourceReturn {
  activeVerse: Verse | null;
  isLoading: boolean;
  currentError: string | null;
  handleRotation: () => void;
  refreshVerse: () => void;
}

export function useVerseSource({
  translationId,
  randomVerseInterval,
  rotationCountRef,
}: UseVerseSourceOptions): UseVerseSourceReturn {
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

  // Shared verse update logic
  const updateVerse = useCallback(() => {
    if (randomVerse.isAvailable) {
      randomVerse.refresh();
    } else {
      fallbackVerse.nextVerse();
    }
  }, [randomVerse, fallbackVerse]);

  // Handle verse rotation
  const handleRotation = useCallback(() => {
    rotationCountRef.current += 1;

    if (rotationCountRef.current >= randomVerseInterval) {
      updateVerse();
      rotationCountRef.current = 0;
    } else {
      fallbackVerse.nextVerse();
    }
  }, [randomVerseInterval, updateVerse, fallbackVerse, rotationCountRef]);

  return {
    activeVerse,
    isLoading,
    currentError,
    handleRotation,
    refreshVerse: updateVerse,
  };
}
