import { getEnvVar, parseBooleanEnv, parseNumberEnv } from './utils';

/**
 * Cache configuration segment.
 *
 * Determines caching behaviour for client-side data.
 */
export interface CacheConfig {
  ttl: number;
  maxSize: number;
  enableMemoryCache: boolean;
  enableIndexedDBCache: boolean;
  cachePrefix: string;
}

const resolvePositiveNumber = (value: number | undefined, fallback: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return fallback;
  return value;
};

export const cacheConfig: CacheConfig = {
  ttl: resolvePositiveNumber(parseNumberEnv('CACHE_TTL', 300000), 300000),
  maxSize: resolvePositiveNumber(parseNumberEnv('CACHE_MAX_SIZE', 50), 50),
  enableMemoryCache: parseBooleanEnv('CACHE_ENABLE_MEMORY', true),
  enableIndexedDBCache: parseBooleanEnv('CACHE_ENABLE_INDEXEDDB', true),
  cachePrefix: getEnvVar('CACHE_PREFIX', 'quran-app-cache') ?? 'quran-app-cache',
};
