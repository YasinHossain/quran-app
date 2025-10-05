import { MutableRefObject, useCallback, useEffect, useRef } from 'react';

import { ILogger } from '@/src/domain/interfaces/ILogger';

import { clearCacheMap, getCacheStatsFromMap } from './useAudioPrefetch.cache';
import {
  type CacheRef,
  type PrefetchingRef,
  type PrefetchTaskContext,
  getCachedObjectUrl,
  prefetchAudioTask,
} from './useAudioPrefetch.tasks';

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

type PrefetchAudioHandlerDeps = Omit<PrefetchTaskContext, 'url'>;

const useCacheRef = (): CacheRef => useRef<Map<string, PrefetchedAudio>>(new Map());
const usePrefetchingRef = (): PrefetchingRef => useRef<Set<string>>(new Set());

function useLoggerRef(logger: ILogger): MutableRefObject<ILogger> {
  const loggerRef = useRef<ILogger>(logger);
  useEffect(() => {
    loggerRef.current = logger;
  }, [logger]);
  return loggerRef;
}

const usePrefetchAudioHandler = ({
  enabled,
  maxCacheSize,
  cacheRef,
  prefetchingRef,
  loggerRef,
}: PrefetchAudioHandlerDeps): ((url: string) => Promise<string | null>) =>
  useCallback(
    (url: string) =>
      prefetchAudioTask({
        enabled,
        maxCacheSize,
        url,
        cacheRef,
        prefetchingRef,
        loggerRef,
      }),
    [enabled, maxCacheSize, cacheRef, prefetchingRef, loggerRef]
  );

const useCacheLookup = (cacheRef: CacheRef): ((url: string) => string | null) =>
  useCallback((url: string) => getCachedObjectUrl(cacheRef, url), [cacheRef]);

const useCacheClearer = (cacheRef: CacheRef, loggerRef: MutableRefObject<ILogger>): (() => void) =>
  useCallback(() => {
    clearCacheMap(cacheRef.current, loggerRef.current);
  }, [cacheRef, loggerRef]);

const useCacheStatsGetter = (cacheRef: CacheRef): (() => { count: number; totalSize: number }) =>
  useCallback(() => getCacheStatsFromMap(cacheRef.current), [cacheRef]);

const useCacheCleanupOnUnmount = (clearCache: () => void): void => {
  useEffect(() => () => clearCache(), [clearCache]);
};

export function useAudioPrefetchCache({
  enabled,
  maxCacheSize,
  logger,
}: UseAudioPrefetchCacheParams): AudioPrefetchCacheHandlers {
  const cacheRef = useCacheRef();
  const prefetchingRef = usePrefetchingRef();
  const loggerRef = useLoggerRef(logger);

  const prefetchAudio = usePrefetchAudioHandler({
    enabled,
    maxCacheSize,
    cacheRef,
    prefetchingRef,
    loggerRef,
  });

  const getPrefetchedUrl = useCacheLookup(cacheRef);
  const clearCache = useCacheClearer(cacheRef, loggerRef);
  const getCacheStats = useCacheStatsGetter(cacheRef);

  useCacheCleanupOnUnmount(clearCache);

  return { prefetchAudio, getPrefetchedUrl, clearCache, getCacheStats };
}
