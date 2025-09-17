import { logger } from '@/src/infrastructure/monitoring/Logger';

import { useAdjacentAudioPrefetch } from './useAdjacentAudioPrefetch';
import { useAudioPrefetchCache } from './useAudioPrefetch.helpers';

import type { PrefetchOptions } from './useAudioPrefetch.types';

export function useAudioPrefetch(
  currentAudioUrl: string | null,
  getNextAudioUrl?: () => string | null,
  getPreviousAudioUrl?: () => string | null,
  options: PrefetchOptions = {}
): {
  prefetchAudio: (url: string) => Promise<string | null>;
  getPrefetchedUrl: (url: string) => string | null;
  clearCache: () => void;
  getCacheStats: () => { count: number; totalSize: number };
} {
  const {
    maxCacheSize = 50 * 1024 * 1024,
    prefetchNext = true,
    prefetchPrevious = false,
    enabled = true,
  } = options;

  const { prefetchAudio, getPrefetchedUrl, clearCache, getCacheStats } = useAudioPrefetchCache({
    enabled,
    maxCacheSize,
    logger,
  });

  useAdjacentAudioPrefetch({
    enabled,
    currentAudioUrl,
    prefetchNext,
    prefetchPrevious,
    getNextAudioUrl,
    getPreviousAudioUrl,
    prefetchAudio,
    logger,
  });

  return { prefetchAudio, getPrefetchedUrl, clearCache, getCacheStats };
}
