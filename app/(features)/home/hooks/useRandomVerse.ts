'use client';

import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { Verse } from '@/types';
import { getRandomVerse } from '@/lib/api';

interface UseRandomVerseOptions {
  translationId: number;
  onError?: (error: Error) => void;
}

interface UseRandomVerseReturn {
  verse: Verse | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  isAvailable: boolean;
}

/**
 * Hook for fetching random verses from the API
 * Handles graceful fallback when random API is unavailable
 */
export function useRandomVerse({
  translationId,
  onError,
}: UseRandomVerseOptions): UseRandomVerseReturn {
  const [isAvailable, setIsAvailable] = useState(true);

  const randomVerseFetcher = useCallback(async (): Promise<Verse> => {
    try {
      return await getRandomVerse(translationId);
    } catch (error) {
      console.warn('Random verse API failed:', error);
      setIsAvailable(false);
      onError?.(error as Error);
      throw error;
    }
  }, [translationId, onError]);

  const {
    data: verse,
    error: swrError,
    mutate,
  } = useSWR(isAvailable ? ['random-verse', translationId] : null, randomVerseFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
    dedupingInterval: 30000, // Don't refetch for 30 seconds
  });

  const refresh = useCallback(() => {
    if (!isAvailable && Math.random() < 0.5) {
      // 50% chance to retry random API
      setIsAvailable(true);
    }
    mutate();
  }, [isAvailable, mutate]);

  return {
    verse: verse || null,
    loading: isAvailable && !verse && !swrError,
    error: swrError ? 'Failed to load random verse' : null,
    refresh,
    isAvailable,
  };
}
