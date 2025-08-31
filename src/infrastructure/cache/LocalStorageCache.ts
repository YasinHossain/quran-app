// import { injectable } from 'inversify';
import { ICache, CacheEntry } from '../../domain/repositories/ICache';

// // // @injectable()
export class LocalStorageCache implements ICache {
  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isClient()) {
      return null;
    }

    try {
      const item = localStorage.getItem(`quran_cache_${key}`);
      if (!item) {
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(item);

      // Check if expired
      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        await this.remove(key);
        return null;
      }

      return entry.value;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    if (!this.isClient()) {
      return;
    }

    try {
      const entry: CacheEntry<T> = {
        value,
        createdAt: Date.now(),
        expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
      };

      localStorage.setItem(`quran_cache_${key}`, JSON.stringify(entry));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async remove(key: string): Promise<void> {
    if (!this.isClient()) {
      return;
    }

    try {
      localStorage.removeItem(`quran_cache_${key}`);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  }

  async clear(): Promise<void> {
    if (!this.isClient()) {
      return;
    }

    try {
      const keys = Object.keys(localStorage).filter((key) => key.startsWith('quran_cache_'));
      keys.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    return (await this.get(key)) !== null;
  }
}
