// Incremental cache for appquran.com on Cloudflare Workers (used by `open-next.config.ts`).
//
// Why: R2 is single-region. With one APAC bucket, every page lookup and every `fetch()` data-cache
// lookup/write from a US data center crossed the Pacific (a first render took ~2 s wall for ~77 ms
// CPU). OpenNext also keys entries with the build ID, so each deploy dropped the upstream API data.
//
// Routing by cache type:
// - `fetch` (Next data cache: `fetch(..., { next })` and `unstable_cache`): the per-data-center
//   Cache API under a build-independent key, so raw upstream responses survive deploys. Writes run
//   in `waitUntil`. Next still decides staleness from `lastModified` + `revalidate`.
//   `unstable_cache` results (stored with an empty `data.url`) come from our own code, whose output
//   shape can change between builds, so they are only reused by the build that wrote them.
// - `cache` (ISR pages, route handlers) and `composable` (`'use cache'`, unused today): two R2
//   buckets, one per region, read from the nearest. Fronted by OpenNext's long-lived regional
//   cache (Cache API per data center). Keys keep OpenNext's format (prefix/buildId/hash.type) so
//   `opennextjs-cloudflare populateCache`/`deploy` uploads prerendered pages where we read them.
//
// Errors never escape: a failed read returns null (Next renders), a failed write is logged.
import { createHash } from 'node:crypto';

import { getCloudflareContext } from '@opennextjs/cloudflare';
import {
  BINDING_NAME as R2_BINDING_NAME,
  NAME as R2_CACHE_NAME,
  PREFIX_ENV_NAME as R2_PREFIX_ENV_NAME,
} from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache';
import { withRegionalCache } from '@opennextjs/cloudflare/overrides/incremental-cache/regional-cache';
import { computeCacheKey } from '@opennextjs/cloudflare/overrides/internal';

import type {
  CacheEntryType,
  CacheValue,
  IncrementalCache,
  WithLastModified,
} from '@opennextjs/aws/types/overrides.js';

/** Binding of the ENAM bucket. It keeps OpenNext's name so the deploy CLI populates it. */
const ENAM_BINDING = R2_BINDING_NAME; // NEXT_INC_CACHE_R2_BUCKET -> appquran-cache-enam
/** Binding of the APAC bucket (populated by `npm run cf:populate:apac`). */
const APAC_BINDING = 'NEXT_INC_CACHE_R2_BUCKET_APAC'; // -> appquran-opennext-cache

/** Bump when Next's fetch-entry format changes, so old Cache API entries are ignored. */
const DATA_CACHE_VERSION = 'v1';
const DATA_CACHE_ORIGIN = 'https://data-cache.internal';
/** 30 days, like the R2 lifecycle rule. Data centers may evict earlier. */
const DATA_CACHE_MAX_AGE_SEC = 2_592_000;

/** Minimal R2 surface used here (the project has no `@cloudflare/workers-types`). */
interface R2BucketLike {
  get(key: string): Promise<{ json<T>(): Promise<T>; uploaded: Date } | null>;
  put(key: string, value: string): Promise<unknown>;
  delete(key: string): Promise<void>;
}

type Entry<T extends CacheEntryType> = WithLastModified<CacheValue<T>>;

/** What a data-cache response body holds. */
interface DataEnvelope extends Entry<'fetch'> {
  /** Build that wrote the entry; `unstable_cache` results are ignored by other builds. */
  buildId?: string;
}

/** `unstable_cache` stores its result as a FETCH entry with an empty `data.url`. */
function isUnstableCacheResult(value: unknown): boolean {
  return (value as { data?: { url?: unknown } } | undefined)?.data?.url === '';
}

function logError(message: string, e: unknown): void {
  console.error(`[incremental-cache] ${message}`, e);
}

/** Logs only with `NEXT_PRIVATE_DEBUG_CACHE` set, like OpenNext's own cache debug output. */
function debug(message: string): void {
  // eslint-disable-next-line no-console -- opt-in debug output
  if (process.env['NEXT_PRIVATE_DEBUG_CACHE']) console.log(`[incremental-cache] ${message}`);
}

/** Continents served by the APAC bucket; everything else (and unknown) uses ENAM. */
export function pickNearestBinding(continent: string | undefined): string {
  return continent === 'AS' || continent === 'OC' ? APAC_BINDING : ENAM_BINDING;
}

// ---------------------------------------------------------------------------------------------
// Pages: two R2 buckets
// ---------------------------------------------------------------------------------------------

function getBuckets(): {
  nearestName: string;
  nearest: R2BucketLike | undefined;
  other: R2BucketLike | undefined;
} {
  const { env, cf } = getCloudflareContext();
  const bindings = env as unknown as Record<string, R2BucketLike | undefined>;
  // `cf` is missing on internal requests (e.g. revalidation through the self-reference binding).
  const continent = (cf as { continent?: string } | undefined)?.continent;
  const nearestName = pickNearestBinding(continent);
  const otherName = nearestName === APAC_BINDING ? ENAM_BINDING : APAC_BINDING;
  return { nearestName, nearest: bindings[nearestName], other: bindings[otherName] };
}

function pageKey(key: string, cacheType?: CacheEntryType): string {
  const env = getCloudflareContext().env as unknown as Record<string, string | undefined>;
  return computeCacheKey(key, {
    prefix: env[R2_PREFIX_ENV_NAME],
    buildId: process.env['OPEN_NEXT_BUILD_ID'],
    ...(cacheType ? { cacheType } : {}),
  });
}

/** Store behind the regional cache. Mirrors `r2-incremental-cache.js`, with two buckets. */
const twoRegionPageStore: IncrementalCache = {
  name: R2_CACHE_NAME,

  async get<T extends CacheEntryType = 'cache'>(key: string, cacheType?: T) {
    try {
      const { nearestName, nearest } = getBuckets();
      if (!nearest) return null;
      const object = await nearest.get(pageKey(key, cacheType));
      debug(`page get ${key} from ${nearestName}: ${object ? 'hit' : 'miss'}`);
      if (!object) return null;
      return {
        value: await object.json<CacheValue<T>>(),
        lastModified: object.uploaded.getTime(),
      } as Entry<T>;
    } catch (e) {
      logError('page get failed', e);
      return null;
    }
  },

  async set<T extends CacheEntryType = 'cache'>(key: string, value: CacheValue<T>, cacheType?: T) {
    try {
      const { nearest, other } = getBuckets();
      const r2Key = pageKey(key, cacheType);
      const body = JSON.stringify(value);
      // The other region is written in the background: revalidations from the DO queue can run
      // anywhere, and both buckets must stay full for their readers.
      if (other) {
        getCloudflareContext().ctx.waitUntil(
          other
            .put(r2Key, body)
            .catch((e: unknown) => logError('page set (other region) failed', e))
        );
      }
      await nearest?.put(r2Key, body);
    } catch (e) {
      logError('page set failed', e);
    }
  },

  async delete(key: string) {
    try {
      const { nearest, other } = getBuckets();
      const r2Key = pageKey(key);
      await Promise.all([nearest?.delete(r2Key), other?.delete(r2Key)]);
    } catch (e) {
      logError('page delete failed', e);
    }
  },
};

const pageCache = withRegionalCache(twoRegionPageStore, { mode: 'long-lived' });

// ---------------------------------------------------------------------------------------------
// Fetch data: per-data-center Cache API, independent of the build
// ---------------------------------------------------------------------------------------------

function dataCacheUrl(key: string): string {
  const hash = createHash('sha256').update(key).digest('hex');
  return `${DATA_CACHE_ORIGIN}/${DATA_CACHE_VERSION}/${hash}`;
}

let dataCacheInstance: Cache | undefined;
async function openDataCache(): Promise<Cache> {
  dataCacheInstance ??= await caches.open('data-cache');
  return dataCacheInstance;
}

const dataCache = {
  async get(key: string): Promise<Entry<'fetch'> | null> {
    try {
      const response = await (await openDataCache()).match(dataCacheUrl(key));
      debug(`data get ${key}: ${response ? 'hit' : 'miss'}`);
      if (!response) return null;
      const entry = (await response.json()) as Partial<DataEnvelope>;
      if (!entry.value || typeof entry.lastModified !== 'number') return null;
      if (
        isUnstableCacheResult(entry.value) &&
        entry.buildId !== process.env['OPEN_NEXT_BUILD_ID']
      ) {
        debug(`data get ${key}: unstable_cache result from another build, ignored`);
        return null;
      }
      return { value: entry.value, lastModified: entry.lastModified };
    } catch (e) {
      logError('data get failed', e);
      return null;
    }
  },

  async set(key: string, value: CacheValue<'fetch'>): Promise<void> {
    try {
      const buildId = process.env['OPEN_NEXT_BUILD_ID'];
      const envelope: DataEnvelope = {
        value,
        lastModified: Date.now(),
        ...(buildId ? { buildId } : {}),
      };
      const body = JSON.stringify(envelope);
      const write = openDataCache().then((cache) =>
        cache.put(
          dataCacheUrl(key),
          new Response(body, {
            headers: {
              'content-type': 'application/json',
              'cache-control': `max-age=${DATA_CACHE_MAX_AGE_SEC}`,
            },
          })
        )
      );
      getCloudflareContext().ctx.waitUntil(
        write.catch((e: unknown) => logError('data set failed', e))
      );
    } catch (e) {
      logError('data set failed', e);
    }
  },

  async delete(key: string): Promise<void> {
    try {
      await (await openDataCache()).delete(dataCacheUrl(key));
    } catch (e) {
      logError('data delete failed', e);
    }
  },
};

// ---------------------------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------------------------

/**
 * `name` must stay OpenNext's R2 cache name: `opennextjs-cloudflare populateCache`/`deploy` pick
 * the upload target by it (binding `NEXT_INC_CACHE_R2_BUCKET` of the selected wrangler env).
 */
const incrementalCache: IncrementalCache = {
  name: R2_CACHE_NAME,

  async get<T extends CacheEntryType = 'cache'>(key: string, cacheType?: T) {
    if (cacheType === 'fetch') return (await dataCache.get(key)) as Entry<T> | null;
    return pageCache.get(key, cacheType);
  },

  async set<T extends CacheEntryType = 'cache'>(key: string, value: CacheValue<T>, cacheType?: T) {
    if (cacheType === 'fetch') return dataCache.set(key, value as CacheValue<'fetch'>);
    return pageCache.set(key, value, cacheType);
  },

  // Called without a cache type when Next stores `null`; clear both kinds.
  async delete(key: string) {
    await Promise.all([pageCache.delete(key), dataCache.delete(key)]);
  },
};

export default incrementalCache;
