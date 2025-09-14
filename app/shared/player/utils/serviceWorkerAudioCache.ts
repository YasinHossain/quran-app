import { ILogger } from '@/src/domain/interfaces/ILogger';
import { logger } from '@/src/infrastructure/monitoring/Logger';

interface AudioCacheOptions {
  cacheName?: string;
  maxAge?: number;
  maxEntries?: number;
}

/**
 * Service Worker utilities for audio caching
 * Provides programmatic control over PWA audio cache
 */
export class ServiceWorkerAudioCache {
  private readonly logger: ILogger;
  private readonly cacheName: string;
  private readonly maxAge: number;
  private readonly maxEntries: number;

  constructor(options: AudioCacheOptions = {}) {
    this.logger = logger;
    this.cacheName = options.cacheName || 'quran-audio-cache-v1';
    this.maxAge = options.maxAge || 7 * 24 * 60 * 60 * 1000; // 7 days
    this.maxEntries = options.maxEntries || 50;
  }

  /**
   * Check if service worker and Cache API are available
   */
  private isSupported(): boolean {
    return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'caches' in window;
  }

  /**
   * Preload audio file into cache for offline access
   */
  async preloadAudio(url: string): Promise<boolean> {
    if (!this.isSupported()) {
      this.logger.debug('Service worker or Cache API not supported');
      return false;
    }

    try {
      const cache = await caches.open(this.cacheName);

      // Check if already cached
      const cached = await cache.match(url);
      if (cached) {
        this.logger.debug('Audio already cached', { url });
        return true;
      }

      // Preload with range request for better streaming support
      const response = await fetch(url, {
        headers: {
          Range: 'bytes=0-',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.status}`);
      }

      await cache.put(url, response);
      await this.cleanupOldEntries();

      this.logger.info('Audio preloaded successfully', { url });
      return true;
    } catch (error) {
      this.logger.error('Failed to preload audio', {
        url,
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * Check if audio is cached
   */
  async isCached(url: string): Promise<boolean> {
    if (!this.isSupported()) return false;

    try {
      const cache = await caches.open(this.cacheName);
      const response = await cache.match(url);
      return response !== undefined;
    } catch (error) {
      this.logger.warn('Failed to check cache', {
        url,
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * Remove specific audio from cache
   */
  async removeFromCache(url: string): Promise<boolean> {
    if (!this.isSupported()) return false;

    try {
      const cache = await caches.open(this.cacheName);
      const deleted = await cache.delete(url);

      if (deleted) {
        this.logger.debug('Audio removed from cache', { url });
      }

      return deleted;
    } catch (error) {
      this.logger.warn('Failed to remove from cache', {
        url,
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{
    count: number;
    totalSize: number;
    entries: Array<{ url: string; size: number; timestamp: number }>;
  }> {
    if (!this.isSupported()) {
      return { count: 0, totalSize: 0, entries: [] };
    }

    try {
      const cache = await caches.open(this.cacheName);
      const keys = await cache.keys();
      const entries: Array<{ url: string; size: number; timestamp: number }> = [];
      let totalSize = 0;

      for (const request of keys) {
        try {
          const response = await cache.match(request);
          if (response) {
            const size = await this.getResponseSize(response);
            const timestamp = this.getResponseTimestamp(response);

            entries.push({
              url: request.url,
              size,
              timestamp,
            });

            totalSize += size;
          }
        } catch (error) {
          // Skip entries that can't be read
          this.logger.debug('Failed to read cache entry', { url: request.url });
        }
      }

      return { count: entries.length, totalSize, entries };
    } catch (error) {
      this.logger.warn('Failed to get cache stats', {
        error: error instanceof Error ? error.message : String(error),
      });
      return { count: 0, totalSize: 0, entries: [] };
    }
  }

  /**
   * Clear entire audio cache
   */
  async clearCache(): Promise<boolean> {
    if (!this.isSupported()) return false;

    try {
      const deleted = await caches.delete(this.cacheName);

      if (deleted) {
        this.logger.info('Audio cache cleared');
      }

      return deleted;
    } catch (error) {
      this.logger.error('Failed to clear cache', {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * Cleanup old entries based on age and count limits
   */
  private async cleanupOldEntries(): Promise<void> {
    try {
      const stats = await this.getCacheStats();
      const now = Date.now();
      const cache = await caches.open(this.cacheName);

      // Sort by timestamp (oldest first)
      const sortedEntries = stats.entries.sort((a, b) => a.timestamp - b.timestamp);

      // Remove entries that are too old
      const oldEntries = sortedEntries.filter((entry) => now - entry.timestamp > this.maxAge);

      // Remove excess entries if over limit
      const excessCount = Math.max(0, sortedEntries.length - this.maxEntries);
      const entriesToRemove = [...oldEntries];

      if (excessCount > 0) {
        entriesToRemove.push(...sortedEntries.slice(0, excessCount));
      }

      // Remove duplicate URLs and delete from cache
      const urlsToRemove = [...new Set(entriesToRemove.map((entry) => entry.url))];

      for (const url of urlsToRemove) {
        await cache.delete(url);
      }

      if (urlsToRemove.length > 0) {
        this.logger.debug('Cache cleanup completed', {
          removedCount: urlsToRemove.length,
          reason: oldEntries.length > 0 ? 'age and count limits' : 'count limit',
        });
      }
    } catch (error) {
      this.logger.warn('Cache cleanup failed', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Get response size (approximate)
   */
  private async getResponseSize(response: Response): Promise<number> {
    try {
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        return parseInt(contentLength, 10);
      }

      // Fallback: clone and read blob size
      const clone = response.clone();
      const blob = await clone.blob();
      return blob.size;
    } catch {
      return 0;
    }
  }

  /**
   * Get response timestamp from headers or current time
   */
  private getResponseTimestamp(response: Response): number {
    const dateHeader = response.headers.get('date');
    if (dateHeader) {
      const date = new Date(dateHeader);
      if (!isNaN(date.getTime())) {
        return date.getTime();
      }
    }
    return Date.now();
  }

  /**
   * Preload a list of audio URLs with concurrency control
   */
  async preloadAudioList(
    urls: string[],
    options: { concurrency?: number; priority?: 'high' | 'low' } = {}
  ): Promise<{ successful: string[]; failed: string[] }> {
    const { concurrency = 3, priority = 'low' } = options;
    const successful: string[] = [];
    const failed: string[] = [];

    this.logger.info('Starting batch audio preload', { count: urls.length, concurrency });

    // Process URLs in batches
    for (let i = 0; i < urls.length; i += concurrency) {
      const batch = urls.slice(i, i + concurrency);
      const batchPromises = batch.map(async (url) => {
        // Add delay for low priority to not block other requests
        if (priority === 'low') {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        const success = await this.preloadAudio(url);
        if (success) {
          successful.push(url);
        } else {
          failed.push(url);
        }
      });

      await Promise.allSettled(batchPromises);
    }

    this.logger.info('Batch audio preload completed', {
      successful: successful.length,
      failed: failed.length,
      total: urls.length,
    });

    return { successful, failed };
  }
}

// Export singleton instance
export const audioCache = new ServiceWorkerAudioCache();
