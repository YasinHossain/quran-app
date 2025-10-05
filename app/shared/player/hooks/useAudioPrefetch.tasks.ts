import { ILogger } from '@/src/domain/interfaces/ILogger';

import { cleanupOldCache } from './useAudioPrefetch.cache';

import type { PrefetchedAudio } from './useAudioPrefetch.types';
import type { MutableRefObject } from 'react';

export const PREFETCH_TIMEOUT_MS = 30_000;

export type CacheRef = MutableRefObject<Map<string, PrefetchedAudio>>;
export type PrefetchingRef = MutableRefObject<Set<string>>;

export interface PrefetchTaskContext {
  enabled: boolean;
  maxCacheSize: number;
  url: string;
  cacheRef: CacheRef;
  prefetchingRef: PrefetchingRef;
  loggerRef: MutableRefObject<ILogger>;
}

export const getCachedObjectUrl = (cacheRef: CacheRef, url: string): string | null =>
  cacheRef.current.get(url)?.objectUrl ?? null;

const shouldSkipPrefetch = ({
  enabled,
  url,
  cacheRef,
  prefetchingRef,
}: PrefetchTaskContext): boolean =>
  !enabled || !url || cacheRef.current.has(url) || prefetchingRef.current.has(url);

const fetchAudioBlob = async (url: string, loggerRef: MutableRefObject<ILogger>): Promise<Blob> => {
  loggerRef.current.debug('Prefetching audio', { url });

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), PREFETCH_TIMEOUT_MS) : null;

  try {
    const response = await fetch(url, {
      signal: controller?.signal ?? null,
      headers: { Range: 'bytes=0-1024' },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    return await response.blob();
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

const logPrefetchFailure = (
  loggerRef: MutableRefObject<ILogger>,
  url: string,
  error: unknown
): void => {
  loggerRef.current.warn('Audio prefetch failed', {
    url,
    error: error instanceof Error ? error.message : String(error),
  });
};

const storeAudioInCache = (context: PrefetchTaskContext, blob: Blob): string => {
  const { cacheRef, url, loggerRef, maxCacheSize } = context;
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
};

export const prefetchAudioTask = async (context: PrefetchTaskContext): Promise<string | null> => {
  if (shouldSkipPrefetch(context)) {
    return getCachedObjectUrl(context.cacheRef, context.url);
  }

  context.prefetchingRef.current.add(context.url);

  try {
    const blob = await fetchAudioBlob(context.url, context.loggerRef);
    return storeAudioInCache(context, blob);
  } catch (error) {
    logPrefetchFailure(context.loggerRef, context.url, error);
    return null;
  } finally {
    context.prefetchingRef.current.delete(context.url);
  }
};
