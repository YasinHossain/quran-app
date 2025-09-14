import { useEffect, useCallback, useRef } from 'react';

import { ILogger } from '@/src/domain/interfaces/ILogger';
import { logger } from '@/src/infrastructure/monitoring/Logger';

interface PrefetchOptions {
  maxCacheSize?: number;
  prefetchNext?: boolean;
  prefetchPrevious?: boolean;
  enabled?: boolean;
}

interface PrefetchedAudio {
  url: string;
  blob?: Blob;
  objectUrl?: string;
  timestamp: number;
  size: number;
}

/**
 * Hook for prefetching audio segments to enable instant playback
 * Implements intelligent caching with size limits and cleanup
 */
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
    maxCacheSize = 50 * 1024 * 1024, // 50MB default cache size
    prefetchNext = true,
    prefetchPrevious = false,
    enabled = true,
  } = options;

  const cacheRef = useRef<Map<string, PrefetchedAudio>>(new Map());
  const prefetchingRef = useRef<Set<string>>(new Set());
  const loggerRef = useRef<ILogger>(logger);

  const cleanupOldCache = useCallback(() => {
    const cache = cacheRef.current;
    let totalSize = 0;
    const entries = Array.from(cache.entries());

    // Calculate total size
    for (const [, audio] of entries) {
      totalSize += audio.size;
    }

    // Remove oldest entries if over size limit
    if (totalSize > maxCacheSize) {
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

      while (totalSize > maxCacheSize * 0.8 && entries.length > 0) {
        const [url, audio] = entries.shift()!;
        totalSize -= audio.size;

        // Clean up object URL
        if (audio.objectUrl) {
          URL.revokeObjectURL(audio.objectUrl);
        }

        cache.delete(url);
        loggerRef.current.debug('Audio cache cleanup', {
          removedUrl: url,
          newTotalSize: totalSize,
        });
      }
    }
  }, [maxCacheSize]);

  const prefetchAudio = useCallback(
    async (url: string): Promise<string | null> => {
      if (!enabled || !url || cacheRef.current.has(url) || prefetchingRef.current.has(url)) {
        return cacheRef.current.get(url)?.objectUrl || null;
      }

      prefetchingRef.current.add(url);

      try {
        loggerRef.current.debug('Prefetching audio', { url });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            Range: 'bytes=0-1024', // Prefetch first 1KB for instant start
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        const prefetchedAudio: PrefetchedAudio = {
          url,
          blob,
          objectUrl,
          timestamp: Date.now(),
          size: blob.size,
        };

        cacheRef.current.set(url, prefetchedAudio);
        cleanupOldCache();

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
    [enabled, cleanupOldCache]
  );

  const getPrefetchedUrl = useCallback((url: string): string | null => {
    return cacheRef.current.get(url)?.objectUrl || null;
  }, []);

  const clearCache = useCallback(() => {
    for (const [, audio] of cacheRef.current) {
      if (audio.objectUrl) {
        URL.revokeObjectURL(audio.objectUrl);
      }
    }
    cacheRef.current.clear();
    loggerRef.current.debug('Audio cache cleared');
  }, []);

  const getCacheStats = useCallback(() => {
    let totalSize = 0;
    for (const [, audio] of cacheRef.current) {
      totalSize += audio.size;
    }
    return {
      count: cacheRef.current.size,
      totalSize,
    };
  }, []);

  // Prefetch adjacent audio files when current audio changes
  useEffect(() => {
    if (!enabled || !currentAudioUrl) return;

    const prefetchTasks: Promise<void>[] = [];

    // Prefetch next audio
    if (prefetchNext && getNextAudioUrl) {
      const nextUrl = getNextAudioUrl();
      if (nextUrl) {
        prefetchTasks.push(
          prefetchAudio(nextUrl)
            .then(() => {
              loggerRef.current.debug('Next audio prefetched', { nextUrl });
            })
            .catch(() => {
              // Silently handle prefetch failures
            })
        );
      }
    }

    // Prefetch previous audio
    if (prefetchPrevious && getPreviousAudioUrl) {
      const previousUrl = getPreviousAudioUrl();
      if (previousUrl) {
        prefetchTasks.push(
          prefetchAudio(previousUrl)
            .then(() => {
              loggerRef.current.debug('Previous audio prefetched', { previousUrl });
            })
            .catch(() => {
              // Silently handle prefetch failures
            })
        );
      }
    }

    // Execute prefetch tasks
    Promise.allSettled(prefetchTasks);
  }, [
    currentAudioUrl,
    enabled,
    prefetchNext,
    prefetchPrevious,
    getNextAudioUrl,
    getPreviousAudioUrl,
    prefetchAudio,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearCache();
    };
  }, [clearCache]);

  return {
    prefetchAudio,
    getPrefetchedUrl,
    clearCache,
    getCacheStats,
  };
}
