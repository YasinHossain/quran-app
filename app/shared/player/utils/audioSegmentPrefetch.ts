import { ILogger } from '@/src/domain/interfaces/ILogger';
import { logger } from '@/src/infrastructure/monitoring/Logger';

interface AudioSegment {
  url: string;
  start: number;
  end: number;
  priority: 'high' | 'medium' | 'low';
}

interface PrefetchResult {
  url: string;
  success: boolean;
  size: number;
  duration: number;
}

/**
 * Audio segment prefetching service for instant play experience
 * Implements intelligent prefetching of small audio segments
 */
export class AudioSegmentPrefetch {
  private readonly logger: ILogger;
  private readonly cache = new Map<string, ArrayBuffer>();
  private readonly prefetchQueue = new Set<string>();
  private readonly maxCacheSize: number;
  private readonly segmentSize: number;

  constructor(
    options: {
      maxCacheSize?: number;
      segmentSize?: number;
    } = {}
  ) {
    this.logger = logger;
    this.maxCacheSize = options.maxCacheSize || 10 * 1024 * 1024; // 10MB
    this.segmentSize = options.segmentSize || 1024 * 1024; // 1MB segments
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

    if (this.cache.has(url) || this.prefetchQueue.has(url)) {
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

      // Check cache size and cleanup if needed
      await this.ensureCacheSpace(arrayBuffer.byteLength);

      // Store in cache
      this.cache.set(url, arrayBuffer);

      this.logger.info('Audio segment prefetched successfully', {
        url,
        size: arrayBuffer.byteLength,
        duration,
        cacheSize: this.getCacheSize(),
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

    // Sort by priority: high -> medium -> low
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const sortedItems = audioItems.sort((a, b) => {
      const aPriority = priorityOrder[a.priority || 'medium'];
      const bPriority = priorityOrder[b.priority || 'medium'];
      return aPriority - bPriority;
    });

    this.logger.info('Starting batch audio prefetch', {
      total: sortedItems.length,
      maxConcurrent,
      priorityDistribution: this.getPriorityDistribution(sortedItems),
    });

    const results: PrefetchResult[] = [];

    // Process in batches
    for (let i = 0; i < sortedItems.length; i += maxConcurrent) {
      const batch = sortedItems.slice(i, i + maxConcurrent);

      const batchPromises = batch.map(async (item) => {
        const startTime = performance.now();
        const success = await this.prefetchAudioStart(item.url, {
          priority: item.priority,
        });
        const duration = performance.now() - startTime;

        return {
          url: item.url,
          success,
          size: success ? this.cache.get(item.url)?.byteLength || 0 : 0,
          duration,
        };
      });

      const batchResults = await Promise.allSettled(batchPromises);

      // Collect results
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          results.push({
            url: batch[index].url,
            success: false,
            size: 0,
            duration: 0,
          });
        }
      });

      // Add delay between batches to avoid overwhelming the network
      if (i + maxConcurrent < sortedItems.length && delayBetween > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayBetween));
      }
    }

    const successCount = results.filter((r) => r.success).length;
    this.logger.info('Batch audio prefetch completed', {
      successful: successCount,
      failed: results.length - successCount,
      totalSize: results.reduce((sum, r) => sum + r.size, 0),
      cacheSize: this.getCacheSize(),
    });

    return results;
  }

  /**
   * Get prefetched audio data
   */
  getPrefetchedAudio(url: string): ArrayBuffer | null {
    return this.cache.get(url) || null;
  }

  /**
   * Check if audio is prefetched
   */
  isPrefetched(url: string): boolean {
    return this.cache.has(url);
  }

  /**
   * Clear specific audio from cache
   */
  clearAudio(url: string): boolean {
    const deleted = this.cache.delete(url);
    if (deleted) {
      this.logger.debug('Audio removed from prefetch cache', { url });
    }
    return deleted;
  }

  /**
   * Clear entire prefetch cache
   */
  clearCache(): void {
    const size = this.getCacheSize();
    this.cache.clear();
    this.logger.info('Prefetch cache cleared', { clearedSize: size });
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    entries: number;
    totalSize: number;
    averageSize: number;
    urls: string[];
  } {
    const entries = this.cache.size;
    const totalSize = this.getCacheSize();
    const averageSize = entries > 0 ? totalSize / entries : 0;
    const urls = Array.from(this.cache.keys());

    return {
      entries,
      totalSize,
      averageSize,
      urls,
    };
  }

  /**
   * Create blob URL from prefetched data for instant playback
   */
  createBlobUrl(url: string): string | null {
    const data = this.cache.get(url);
    if (!data) {
      return null;
    }

    try {
      const blob = new Blob([data], { type: 'audio/mpeg' });
      const blobUrl = URL.createObjectURL(blob);

      this.logger.debug('Created blob URL for prefetched audio', {
        originalUrl: url,
        blobUrl,
        size: data.byteLength,
      });

      return blobUrl;
    } catch (error) {
      this.logger.error('Failed to create blob URL', {
        url,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
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
  private async ensureCacheSpace(newItemSize: number): Promise<void> {
    const currentSize = this.getCacheSize();

    if (currentSize + newItemSize > this.maxCacheSize) {
      // Remove oldest entries until we have space
      const entries = Array.from(this.cache.entries());
      let removedSize = 0;

      while (removedSize < newItemSize && entries.length > 0) {
        const [url, data] = entries.shift()!;
        this.cache.delete(url);
        removedSize += data.byteLength;
      }

      this.logger.debug('Cache cleanup completed', {
        removedSize,
        remainingSize: this.getCacheSize(),
        spaceNeeded: newItemSize,
      });
    }
  }

  /**
   * Get total cache size in bytes
   */
  private getCacheSize(): number {
    let totalSize = 0;
    for (const data of this.cache.values()) {
      totalSize += data.byteLength;
    }
    return totalSize;
  }

  /**
   * Get priority distribution for logging
   */
  private getPriorityDistribution(
    items: Array<{ priority?: 'high' | 'medium' | 'low' }>
  ): Record<string, number> {
    return items.reduce(
      (acc, item) => {
        const priority = item.priority || 'medium';
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }
}

// Export singleton instance
export const audioSegmentPrefetch = new AudioSegmentPrefetch();
