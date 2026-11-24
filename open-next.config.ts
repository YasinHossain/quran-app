// OpenNext config for Cloudflare Workers (`npm run cf:build`). See https://opennext.js.org/cloudflare
// The adapter runs `npm run build` (webpack, needed by next-pwa) as its Next.js build step.
//
// Caching (https://opennext.js.org/cloudflare/caching): content pages are time-based ISR
// (`revalidate` 7 days) and server data uses `unstable_cache`/fetch with `revalidate`.
// - Incremental cache (`cloudflare/incremental-cache.ts`): pages in two R2 buckets (APAC and ENAM,
//   read from the nearest, behind a long-lived regional cache); fetch data in the per-data-center
//   Cache API under build-independent keys, so it survives deploys. See docs/hosting-cloudflare.md.
// - Durable Object queue: required for time-based revalidation; dedupes background re-renders
//   (binding `NEXT_CACHE_DO_QUEUE`, class `DOQueueHandler`, exported by the generated worker).
// - No tag cache: the app never calls `revalidateTag`/`revalidatePath` (on-demand revalidation).
// - Cache interception: cached ISR pages are served without booting the Next server (less CPU per
//   hit). It runs after the proxy (`proxy.ts`), so language redirects still apply.
import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import doQueue from '@opennextjs/cloudflare/overrides/queue/do-queue';

import incrementalCache from './cloudflare/incremental-cache';

export default defineCloudflareConfig({
  incrementalCache,
  queue: doQueue,
  enableCacheInterception: true,
});
