'use client';

import { useCallback, useState } from 'react';
import useSWR from 'swr';

import { getRandomVerse } from '@/lib/api';
import { logger } from '@/src/infrastructure/monitoring/Logger';
import { Verse } from '@/types';

export const RETRY_LIMIT = 3;

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
  const [, setRetryCount] = useState(0);

  const randomVerseFetcher = useCallback(async (): Promise<Verse> => {
    try {
      const verseData = await getRandomVerse(translationId);
      setRetryCount(0);
      setIsAvailable(true);
      return verseData;
    } catch (error) {
      logger.warn('Random verse API failed', undefined, error as Error);
      setIsAvailable(false);
      setRetryCount(0);
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
    if (!isAvailable) {
      setRetryCount((count) => {
        const next = count + 1;
        if (next >= RETRY_LIMIT) {
          setIsAvailable(true);
          return 0;
        }
        return next;
      });
    } else {
      mutate();
    }
  }, [isAvailable, mutate]);

  return {
    verse: verse || null,
    loading: isAvailable && !verse && !swrError,
    error: swrError ? 'Failed to load random verse' : null,
    refresh,
    isAvailable,
  };
}
