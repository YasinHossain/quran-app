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
    if (!this.isSupported()) return { count: 0, totalSize: 0, entries: [] };
    try {
      const { getCacheStatsFor } = await import('./serviceWorkerAudioCache.helpers');
      return await getCacheStatsFor(this.cacheName, this.logger);
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
      const { cleanupCacheFor } = await import('./serviceWorkerAudioCache.helpers');
      await cleanupCacheFor(this.cacheName, this.logger, this.maxAge, this.maxEntries);
    } catch (error) {
      this.logger.warn('Cache cleanup failed', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Get response size (approximate)
   */
  // Helper methods moved to helpers module

  /**
   * Preload a list of audio URLs with concurrency control
   */
  async preloadAudioList(
    urls: string[],
    options: { concurrency?: number; priority?: 'high' | 'low' } = {}
  ): Promise<{ successful: string[]; failed: string[] }> {
    const { preloadAudioListHelper } = await import('./serviceWorkerAudioCache.helpers');
    return preloadAudioListHelper(urls, (u) => this.preloadAudio(u), this.logger, options);
  }
}

// Export singleton instance
export const audioCache = new ServiceWorkerAudioCache();
