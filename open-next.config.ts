// OpenNext config for Cloudflare Workers (`npm run cf:build`). See https://opennext.js.org/cloudflare
// The adapter runs `npm run build` (webpack, needed by next-pwa) as its Next.js build step.
import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// No incremental cache override yet (defaults to a no-op cache). Production ISR caching adds the R2
// incremental cache plus an `NEXT_INC_CACHE_R2_BUCKET` binding in wrangler.jsonc:
//   import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache';
//   export default defineCloudflareConfig({ incrementalCache: r2IncrementalCache });
export default defineCloudflareConfig();
