import { ICache } from '../../src/infrastructure/cache/ICache';

/**
 * Mock cache implementation for testing
 */
export class MockCache implements ICache {
  private storage = new Map<string, { value: any; expires?: number }>();
  private stats = { hits: 0, misses: 0 };
  private shouldFail: boolean = false;
  private operationLog: Array<{ operation: string; key: string; value?: any; ttl?: number }> = [];

  /**
   * Make all cache operations fail
   */
  setShouldFail(shouldFail: boolean): void {
    this.shouldFail = shouldFail;
  }

  /**
   * Get log of all cache operations
   */
  getOperationLog(): Array<{ operation: string; key: string; value?: any; ttl?: number }> {
    return [...this.operationLog];
  }

  /**
   * Get the number of times a key was accessed
   */
  getAccessCount(key: string): number {
    return this.operationLog.filter(op => op.key === key && op.operation === 'get').length;
  }

  /**
   * Check if a key was ever set
   */
  wasKeySet(key: string): boolean {
    return this.operationLog.some(op => op.key === key && op.operation === 'set');
  }

  /**
   * Reset all mock data
   */
  reset(): void {
    this.storage.clear();
    this.stats = { hits: 0, misses: 0 };
    this.operationLog = [];
    this.shouldFail = false;
  }

  private logOperation(operation: string, key: string, value?: any, ttl?: number): void {
    this.operationLog.push({ operation, key, value, ttl });
  }

  async get<T>(key: string): Promise<T | null> {
    this.logOperation('get', key);

    if (this.shouldFail) {
      throw new Error('Mock cache get operation failed');
    }

    const item = this.storage.get(key);

    if (!item) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (item.expires && Date.now() > item.expires) {
      this.storage.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return item.value;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    this.logOperation('set', key, value, ttlSeconds);

    if (this.shouldFail) {
      throw new Error('Mock cache set operation failed');
    }

    const item: { value: T; expires?: number } = { value };

    if (ttlSeconds) {
      item.expires = Date.now() + (ttlSeconds * 1000);
    }

    this.storage.set(key, item);
  }

  async has(key: string): Promise<boolean> {
    this.logOperation('has', key);

    if (this.shouldFail) {
      throw new Error('Mock cache has operation failed');
    }

    const item = this.storage.get(key);

    if (!item) {
      return false;
    }

    // Check if expired
    if (item.expires && Date.now() > item.expires) {
      this.storage.delete(key);
      return false;
    }

    return true;
  }

  async delete(key: string): Promise<void> {
    this.logOperation('delete', key);

    if (this.shouldFail) {
      throw new Error('Mock cache delete operation failed');
    }

    this.storage.delete(key);
  }

  async clear(): Promise<void> {
    this.logOperation('clear', 'all');

    if (this.shouldFail) {
      throw new Error('Mock cache clear operation failed');
    }

    this.storage.clear();
  }

  async getStats(): Promise<{ keys: number; hits: number; misses: number }> {
    if (this.shouldFail) {
      throw new Error('Mock cache getStats operation failed');
    }

    return {
      keys: this.storage.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
    };
  }

  /**
   * Helper method to directly set an item in storage (for test setup)
   */
  directSet(key: string, value: any, ttlSeconds?: number): void {
    const item: { value: any; expires?: number } = { value };
    if (ttlSeconds) {
      item.expires = Date.now() + (ttlSeconds * 1000);
    }
    this.storage.set(key, item);
  }

  /**
   * Helper method to simulate time passing (for TTL testing)
   */
  simulateTimePass(seconds: number): void {
    // This would be implemented differently in a real scenario
    // For now, we manually expire items
    const currentTime = Date.now();
    for (const [key, item] of this.storage.entries()) {
      if (item.expires && item.expires <= currentTime + (seconds * 1000)) {
        this.storage.delete(key);
      }
    }
  }

  /**
   * Get all stored keys (for debugging)
   */
  getAllKeys(): string[] {
    return Array.from(this.storage.keys());
  }

  /**
   * Get all stored values (for debugging)
   */
  getAllValues(): any[] {
    return Array.from(this.storage.values()).map(item => item.value);
  }
}

/**
 * Factory for creating commonly used mock caches
 */
export class MockCacheFactory {
  /**
   * Creates a mock cache pre-populated with test data
   */
  static createPopulated(): MockCache {
    const cache = new MockCache();
    
    // Pre-populate with some test data
    cache.directSet('verse:1:1', {
      id: '1:1',
      verse_number: 1,
      chapter_id: 1,
      verse_key: '1:1',
      text_simple: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      text_uthmani: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    });

    cache.directSet('surah:1', {
      id: 1,
      name_simple: 'Al-Fatiha',
      name_arabic: 'الفاتحة',
      verses_count: 7,
      revelation_place: 'makkah'
    });

    return cache;
  }

  /**
   * Creates a mock cache that fails all operations
   */
  static createFailing(): MockCache {
    const cache = new MockCache();
    cache.setShouldFail(true);
    return cache;
  }

  /**
   * Creates a mock cache with expired items
   */
  static createWithExpiredItems(): MockCache {
    const cache = new MockCache();
    
    // Add items that are already expired
    const pastTime = Date.now() - 10000; // 10 seconds ago
    cache.directSet('expired:item1', 'value1', -10); // Already expired
    cache.directSet('expired:item2', 'value2', -5);  // Already expired
    cache.directSet('valid:item', 'value', 3600);    // Valid for 1 hour

    return cache;
  }

  /**
   * Creates a mock cache that simulates memory pressure
   */
  static createMemoryConstrained(): MockCache {
    const cache = new MockCache();
    let itemCount = 0;
    const maxItems = 100;

    const originalSet = cache.set.bind(cache);
    cache.set = async function<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
      if (itemCount >= maxItems) {
        throw new Error('Cache memory limit exceeded');
      }
      itemCount++;
      return originalSet(key, value, ttlSeconds);
    };

    const originalDelete = cache.delete.bind(cache);
    cache.delete = async function(key: string): Promise<void> {
      const had = await cache.has(key);
      if (had) {
        itemCount--;
      }
      return originalDelete(key);
    };

    return cache;
  }

  /**
   * Creates a mock cache that tracks access patterns
   */
  static createWithAccessTracking(): MockCache & { getAccessPattern(): Record<string, number> } {
    const cache = new MockCache();
    const accessPattern: Record<string, number> = {};

    const originalGet = cache.get.bind(cache);
    cache.get = async function<T>(key: string): Promise<T | null> {
      accessPattern[key] = (accessPattern[key] || 0) + 1;
      return originalGet(key);
    };

    return Object.assign(cache, {
      getAccessPattern: () => ({ ...accessPattern })
    });
  }
}