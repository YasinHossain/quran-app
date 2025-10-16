'use client';

import { useCallback, useState } from 'react';
import useSWR from 'swr';

import { getRandomVerse } from '@/lib/api';
import { logger } from '@/src/infrastructure/monitoring/Logger';
import { Verse } from '@/types';

export const RETRY_LIMIT = 3;
const SWR_OPTIONS = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: false,
  dedupingInterval: 30000, // Don't refetch for 30 seconds
} as const;

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

type RandomVerseAvailability = {
  isAvailable: boolean;
  lastError: string | null;
  markAvailable: () => void;
  markUnavailable: (error: Error) => void;
  requestRetry: (onAvailable: () => void) => void;
};

type RandomVerseFetcher = () => Promise<Verse>;

/**
 * Hook for fetching random verses from the API
 * Handles graceful fallback when random API is unavailable
 */
export function useRandomVerse({
  translationId,
  onError,
}: UseRandomVerseOptions): UseRandomVerseReturn {
  const { isAvailable, lastError, markAvailable, markUnavailable, requestRetry } =
    useRandomVerseAvailability(onError, shouldPreferRemoteRandomVerse());
  const fetchRandomVerse = useRandomVerseFetcher(translationId, markAvailable, markUnavailable);

  const {
    data: verse,
    error: swrError,
    mutate,
  } = useSWR(isAvailable ? ['random-verse', translationId] : null, fetchRandomVerse, SWR_OPTIONS);

  const refresh = useCallback(() => {
    requestRetry(() => {
      void mutate();
    });
  }, [mutate, requestRetry]);

  const errorMessage = swrError ? 'Unable to connect to Quran service' : lastError;

  return {
    verse: verse || null,
    loading: isAvailable && !verse && !swrError,
    error: errorMessage,
    refresh,
    isAvailable,
  };
}

function shouldPreferRemoteRandomVerse(): boolean {
  if (process.env.NEXT_PUBLIC_ENABLE_RANDOM_VERSE_API === 'true') {
    return true;
  }
  if (process.env.NEXT_PUBLIC_ENABLE_RANDOM_VERSE_API === 'false') {
    return false;
  }
  return process.env.NODE_ENV === 'production';
}

function useRandomVerseAvailability(
  onError: ((error: Error) => void) | undefined,
  preferRemote: boolean
): RandomVerseAvailability {
  const [isAvailable, setIsAvailable] = useState(preferRemote);
  const [, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);

  const markAvailable = useCallback(() => {
    setRetryCount(0);
    setIsAvailable(true);
    setLastError(null);
  }, [setRetryCount, setIsAvailable, setLastError]);

  const markUnavailable = useCallback(
    (error: Error) => {
      setIsAvailable(false);
      setRetryCount(0);
      setLastError('Unable to connect to Quran service');
      onError?.(error);
    },
    [onError, setIsAvailable, setLastError, setRetryCount]
  );

  const requestRetry = useCallback(
    (onAvailable: () => void) => {
      if (!isAvailable) {
        setRetryCount((count) => {
          const next = count + 1;
          if (next >= RETRY_LIMIT) {
            setIsAvailable(true);
            setLastError(null);
            return 0;
          }
          return next;
        });
        return;
      }

      onAvailable();
    },
    [isAvailable, setIsAvailable, setLastError, setRetryCount]
  );

  return { isAvailable, lastError, markAvailable, markUnavailable, requestRetry };
}

function useRandomVerseFetcher(
  translationId: number,
  markAvailable: () => void,
  markUnavailable: (error: Error) => void
): RandomVerseFetcher {
  return useCallback(async (): Promise<Verse> => {
    try {
      const verseData = await getRandomVerse(translationId);
      markAvailable();
      return verseData;
    } catch (error) {
      const handledError = error instanceof Error ? error : new Error('Random verse fetch failed');
      logger.warn('Random verse API failed', undefined, handledError);
      markUnavailable(handledError);
      throw handledError;
    }
  }, [translationId, markAvailable, markUnavailable]);
}
