// OpenNext config for Cloudflare Workers (`npm run cf:build`). See https://opennext.js.org/cloudflare
// The adapter runs `npm run build` (webpack, needed by next-pwa) as its Next.js build step.
//
// Caching (https://opennext.js.org/cloudflare/caching): content pages are time-based ISR
// (`revalidate` 1 day) and server data uses `unstable_cache`/fetch with `revalidate`.
// - R2 incremental cache: stores ISR pages and the data cache (binding `NEXT_INC_CACHE_R2_BUCKET`).
// - Regional cache (Cache API, long-lived): R2 is single-region; serves hot entries from the local
//   data center and cuts R2 reads. Without cache purge it refreshes itself from R2 on hits.
// - Durable Object queue: required for time-based revalidation; dedupes background re-renders
//   (binding `NEXT_CACHE_DO_QUEUE`, class `DOQueueHandler`, exported by the generated worker).
// - No tag cache: the app never calls `revalidateTag`/`revalidatePath` (on-demand revalidation).
// - Cache interception: cached ISR pages are served without booting the Next server (less CPU per
//   hit). It runs after the proxy (`proxy.ts`), so language redirects still apply.
import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache';
import { withRegionalCache } from '@opennextjs/cloudflare/overrides/incremental-cache/regional-cache';
import doQueue from '@opennextjs/cloudflare/overrides/queue/do-queue';

export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, { mode: 'long-lived' }),
  queue: doQueue,
  enableCacheInterception: true,
});
