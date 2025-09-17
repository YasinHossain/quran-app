import { useEffect, useCallback, useRef } from 'react';

import { ILogger } from '@/src/domain/interfaces/ILogger';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import { useAdjacentAudioPrefetch } from './useAdjacentAudioPrefetch';
import { cleanupOldCache, clearCacheMap, getCacheStatsFromMap } from './useAudioPrefetch.cache';

import type { PrefetchOptions, PrefetchedAudio } from './useAudioPrefetch.types';

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

  const cacheRef = useRef<Map<string, PrefetchedAudio>>(new Map());
  const prefetchingRef = useRef<Set<string>>(new Set());
  const loggerRef = useRef<ILogger>(logger);

  const prefetchAudio = useCallback(
    async (url: string): Promise<string | null> => {
      if (!enabled || !url || cacheRef.current.has(url) || prefetchingRef.current.has(url)) {
        return cacheRef.current.get(url)?.objectUrl || null;
      }
      prefetchingRef.current.add(url);
      try {
        loggerRef.current.debug('Prefetching audio', { url });
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        const response = await fetch(url, {
          signal: controller.signal,
          headers: { Range: 'bytes=0-1024' },
        });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        cacheRef.current.set(url, {
          url,
          blob,
          objectUrl,
          timestamp: Date.now(),
          size: blob.size,
        });
        cleanupOldCache(cacheRef.current, maxCacheSize, loggerRef.current);
        loggerRef.current.debug('Audio prefetched successfully', {
          url,
          size: blob.size,
          cacheSize: cacheRef.current.size,
        });
        return objectUrl;
      } catch (error) {
        loggerRef.current.warn('Audio prefetch failed', {
          url,
          error: error instanceof Error ? error.message : String(error),
        });
        return null;
      } finally {
        prefetchingRef.current.delete(url);
      }
    },
    [enabled, maxCacheSize]
  );

  const getPrefetchedUrl = useCallback((url: string): string | null => {
    return cacheRef.current.get(url)?.objectUrl || null;
  }, []);

  const clearCache = useCallback(() => {
    clearCacheMap(cacheRef.current, loggerRef.current);
  }, []);

  const getCacheStats = useCallback(() => getCacheStatsFromMap(cacheRef.current), []);

  useAdjacentAudioPrefetch({
    enabled,
    currentAudioUrl,
    prefetchNext,
    prefetchPrevious,
    getNextAudioUrl,
    getPreviousAudioUrl,
    prefetchAudio,
    logger: loggerRef.current,
  });

  useEffect(() => () => clearCache(), [clearCache]);

  return { prefetchAudio, getPrefetchedUrl, clearCache, getCacheStats };
}
