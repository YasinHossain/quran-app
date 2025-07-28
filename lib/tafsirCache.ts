import { getTafsirByVerse } from './api';

export const CACHE_TTL = 60 * 60 * 1000; // 1 hour in ms
export const MAX_CACHE_SIZE = 50;

interface CacheEntry {
  value: Promise<string>;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

/**
 * Fetch tafsir content with an in-memory cache. Entries expire after an hour
 * and the cache is capped at a fixed size. When the limit is reached, the
 * oldest entries are removed before inserting new ones.
 */
export function getTafsirCached(verseKey: string, tafsirId = 169): Promise<string> {
  const key = `${tafsirId}-${verseKey}`;
  const now = Date.now();

  const cached = cache.get(key);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.value;
  }

  // Clean expired entries
  for (const [k, entry] of cache) {
    if (now - entry.timestamp >= CACHE_TTL) {
      cache.delete(k);
    }
  }

  // Evict oldest if size limit exceeded
  if (cache.size >= MAX_CACHE_SIZE) {
    const oldest = [...cache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp);
    const removeCount = cache.size - MAX_CACHE_SIZE + 1;
    for (let i = 0; i < removeCount; i++) {
      cache.delete(oldest[i][0]);
    }
  }

  const value = getTafsirByVerse(verseKey, tafsirId);
  cache.set(key, { value, timestamp: now });
  return value;
}

export function clearTafsirCache() {
  cache.clear();
}
