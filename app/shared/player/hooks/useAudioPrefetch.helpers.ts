import { MutableRefObject, useCallback, useEffect, useRef } from 'react';

import { ILogger } from '@/src/domain/interfaces/ILogger';

import { cleanupOldCache, clearCacheMap, getCacheStatsFromMap } from './useAudioPrefetch.cache';

import type { PrefetchedAudio } from './useAudioPrefetch.types';

export interface AudioPrefetchCacheHandlers {
  prefetchAudio: (url: string) => Promise<string | null>;
  getPrefetchedUrl: (url: string) => string | null;
  clearCache: () => void;
  getCacheStats: () => { count: number; totalSize: number };
}

interface UseAudioPrefetchCacheParams {
  enabled: boolean;
  maxCacheSize: number;
  logger: ILogger;
}

interface PrefetchAudioTaskParams {
  enabled: boolean;
  maxCacheSize: number;
  url: string;
  cacheRef: MutableRefObject<Map<string, PrefetchedAudio>>;
  prefetchingRef: MutableRefObject<Set<string>>;
  loggerRef: MutableRefObject<ILogger>;
}

async function prefetchAudioTask({
  enabled,
  maxCacheSize,
  url,
  cacheRef,
  prefetchingRef,
  loggerRef,
}: PrefetchAudioTaskParams): Promise<string | null> {
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
}

export function useAudioPrefetchCache({
  enabled,
  maxCacheSize,
  logger,
}: UseAudioPrefetchCacheParams): AudioPrefetchCacheHandlers {
  const cacheRef = useRef<Map<string, PrefetchedAudio>>(new Map());
  const prefetchingRef = useRef<Set<string>>(new Set());
  const loggerRef = useRef<ILogger>(logger);

  useEffect(() => {
    loggerRef.current = logger;
  }, [logger]);

  const prefetchAudio = useCallback(
    (url: string) =>
      prefetchAudioTask({
        enabled,
        maxCacheSize,
        url,
        cacheRef,
        prefetchingRef,
        loggerRef,
      }),
    [enabled, maxCacheSize]
  );

  const getPrefetchedUrl = useCallback(
    (url: string) => cacheRef.current.get(url)?.objectUrl || null,
    []
  );

  const clearCache = useCallback(() => {
    clearCacheMap(cacheRef.current, loggerRef.current);
  }, []);

  const getCacheStats = useCallback(() => getCacheStatsFromMap(cacheRef.current), []);

  useEffect(() => () => clearCache(), [clearCache]);

  return { prefetchAudio, getPrefetchedUrl, clearCache, getCacheStats };
}
