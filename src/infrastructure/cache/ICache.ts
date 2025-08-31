/**
 * Generic cache interface for storing and retrieving data
 */
export interface ICache {
  /**
   * Gets a value from the cache
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Sets a value in the cache
   */
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;

  /**
   * Checks if a key exists in the cache
   */
  has(key: string): Promise<boolean>;

  /**
   * Removes a value from the cache
   */
  delete(key: string): Promise<void>;

  /**
   * Removes all values from the cache
   */
  clear(): Promise<void>;

  /**
   * Gets cache statistics
   */
  getStats(): Promise<{ keys: number; hits: number; misses: number }>;
}

/**
 * In-memory cache implementation
 */
export class MemoryCache implements ICache {
  private cache = new Map<string, { value: any; expires?: number }>();
  private stats = { hits: 0, misses: 0 };

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);

    if (!item) {
      this.stats.misses++;
      return null;
    }

    if (item.expires && Date.now() > item.expires) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return item.value;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const item: { value: T; expires?: number } = { value };

    if (ttlSeconds) {
      item.expires = Date.now() + ttlSeconds * 1000;
    }

    this.cache.set(key, item);
  }

  async has(key: string): Promise<boolean> {
    const item = this.cache.get(key);

    if (!item) return false;

    if (item.expires && Date.now() > item.expires) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async getStats(): Promise<{ keys: number; hits: number; misses: number }> {
    return {
      keys: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
    };
  }
}
