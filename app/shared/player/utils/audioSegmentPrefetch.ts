import { ILogger } from '@/src/domain/interfaces/ILogger';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import { AudioSegmentCache } from './audioSegmentCache';
import { getPriorityDistribution, runAudioBatchPrefetch } from './audioSegmentPrefetch.helpers';

interface PrefetchResult {
  url: string;
  success: boolean;
  size: number;
  duration: number;
}

export class AudioSegmentPrefetch {
  private readonly logger: ILogger;
  private readonly prefetchQueue = new Set<string>();
  private readonly segmentSize: number;
  private readonly cacheManager: AudioSegmentCache;

  constructor(options: { maxCacheSize?: number; segmentSize?: number } = {}) {
    this.logger = logger;
    const maxCacheSize = options.maxCacheSize || 10 * 1024 * 1024; // 10MB
    this.segmentSize = options.segmentSize || 1024 * 1024; // 1MB segments
    this.cacheManager = new AudioSegmentCache(this.logger, maxCacheSize);
  }

  /**
   * Prefetch the beginning of an audio file for instant playback
   */
  async prefetchAudioStart(
    url: string,
    options: {
      priority?: 'high' | 'medium' | 'low';
      bytes?: number;
    } = {}
  ): Promise<boolean> {
    const { priority = 'medium', bytes = this.segmentSize } = options;

    if (this.cacheManager.has(url) || this.prefetchQueue.has(url)) {
      return true;
    }

    this.prefetchQueue.add(url);

    try {
      this.logger.debug('Prefetching audio start segment', { url, bytes, priority });

      const startTime = performance.now();

      // Fetch first segment with range request
      const response = await fetch(url, {
        headers: {
          Range: `bytes=0-${bytes - 1}`,
        },
        signal: AbortSignal.timeout(10000), // 10s timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const duration = performance.now() - startTime;

      await this.cacheManager.ensureSpace(arrayBuffer.byteLength);
      this.cacheManager.set(url, arrayBuffer);

      this.logger.info('Audio segment prefetched successfully', {
        url,
        size: arrayBuffer.byteLength,
        duration,
        cacheSize: this.cacheManager.getSize(),
      });

      return true;
    } catch (error) {
      this.logger.warn('Failed to prefetch audio segment', {
        url,
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    } finally {
      this.prefetchQueue.delete(url);
    }
  }

  /**
   * Prefetch multiple audio segments with priority handling
   */
  async prefetchAudioList(
    audioItems: Array<{
      url: string;
      priority?: 'high' | 'medium' | 'low';
    }>,
    options: {
      maxConcurrent?: number;
      delayBetween?: number;
    } = {}
  ): Promise<PrefetchResult[]> {
    const { maxConcurrent = 3, delayBetween = 100 } = options;
    this.logger.info('Starting batch audio prefetch', {
      total: audioItems.length,
      maxConcurrent,
      delayBetween,
      priorityDistribution: getPriorityDistribution(audioItems),
    });

    return runAudioBatchPrefetch(audioItems, (url, opts) => this.prefetchAudioStart(url, opts), {
      maxConcurrent,
      delayBetween,
    });
  }

  /**
   * Get prefetched audio data
   */
  getPrefetchedAudio(url: string): ArrayBuffer | null {
    return this.cacheManager.get(url);
  }

  /**
   * Check if audio is prefetched
   */
  isPrefetched(url: string): boolean {
    return this.cacheManager.has(url);
  }

  /**
   * Clear specific audio from cache
   */
  clearAudio(url: string): boolean {
    return this.cacheManager.clearAudio(url);
  }

  /**
   * Clear entire prefetch cache
   */
  clearCache(): void {
    this.cacheManager.clearAll();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { entries: number; totalSize: number; averageSize: number; urls: string[] } {
    return this.cacheManager.getStats();
  }

  /**
   * Create blob URL from prefetched data for instant playback
   */
  createBlobUrl(url: string): string | null {
    return this.cacheManager.createBlobUrl(url);
  }

  /**
   * Preload audio for immediate next/previous navigation
   */
  async preloadNavigation(
    currentUrl: string,
    getNextUrl: () => string | null,
    getPreviousUrl: () => string | null
  ): Promise<void> {
    const navigationUrls: Array<{ url: string; priority: 'high' | 'medium' }> = [];

    // High priority for next (user likely to play next)
    const nextUrl = getNextUrl();
    if (nextUrl && nextUrl !== currentUrl) {
      navigationUrls.push({ url: nextUrl, priority: 'high' });
    }

    // Medium priority for previous (less likely but still useful)
    const prevUrl = getPreviousUrl();
    if (prevUrl && prevUrl !== currentUrl) {
      navigationUrls.push({ url: prevUrl, priority: 'medium' });
    }

    if (navigationUrls.length > 0) {
      this.logger.debug('Preloading navigation audio', {
        next: nextUrl,
        previous: prevUrl,
        count: navigationUrls.length,
      });

      await this.prefetchAudioList(navigationUrls, {
        maxConcurrent: 2,
        delayBetween: 0, // No delay for navigation preload
      });
    }
  }

  /**
   * Ensure cache doesn't exceed size limit
   */
  // Cache size/space handled by AudioSegmentCache

  // Priority distribution handled in helpers
}

// Export singleton instance
export const audioSegmentPrefetch = new AudioSegmentPrefetch();
