import { z } from 'zod';

import { getEnvVar, parseBooleanEnv, parseNumberEnv } from './utils';

/**
 * Cache configuration segment.
 *
 * Determines caching behaviour for client-side data.
 */
export const cacheSchema = z.object({
  ttl: z.number().positive().default(300000),
  maxSize: z.number().positive().default(50),
  enableMemoryCache: z.boolean().default(true),
  enableIndexedDBCache: z.boolean().default(true),
  cachePrefix: z.string().default('quran-app-cache'),
});

export type CacheConfig = z.infer<typeof cacheSchema>;

export const cacheConfig: CacheConfig = {
  ttl: parseNumberEnv('CACHE_TTL', 300000)!,
  maxSize: parseNumberEnv('CACHE_MAX_SIZE', 50)!,
  enableMemoryCache: parseBooleanEnv('CACHE_ENABLE_MEMORY', true),
  enableIndexedDBCache: parseBooleanEnv('CACHE_ENABLE_INDEXEDDB', true),
  cachePrefix: getEnvVar('CACHE_PREFIX', 'quran-app-cache')!,
};
