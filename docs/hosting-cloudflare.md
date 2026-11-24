# Hosting appquran.com on Cloudflare Workers

Runbook for a solo developer. Last verified: 2026-11-25.

## Why we moved

- On 2026-11-23 Vercel Hobby paused the project (Fluid Active CPU 4h35m of 4h). About 57k SEO pages were crawled without cache.
- Every URL returned HTTP 402 `DEPLOYMENT_DISABLED`.
- The pause "ends" on 2026-12-23, but Vercel docs say a paused Hobby team does not resume by itself. It needs Vercel support or a Pro team. Hobby cannot buy extra usage.

## Current setup

- Host: Cloudflare Workers Paid ($5/month + usage). Same Cloudflare account as the `appquran.com` zone and the `quran-feedback` worker (feedback.appquran.com).
- Worker name: `appquran` (see `wrangler.jsonc`).
- Test URL: https://appquran.quran-app-v1.workers.dev
- Versions: `@opennextjs/cloudflare` 1.20.18, wrangler 4.168, Next 16.4.6 (adapter needs Next 16 >= 16.4.5).
- Config files: `wrangler.jsonc`, `open-next.config.ts`, `public/_headers` (immutable cache for `/_next/static/*`).

## Build-time environment

Next.js writes `NEXT_PUBLIC_*` values into the build. They must exist when you build.

- Only production variable: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=gSBPbpAerVlzfJAg94piKxCZr73fjpV0VQDD-E9eTDI`
- It is public. It becomes a meta tag on every page. Search Console verifies through it (DNS has no google TXT record).
- It lives in a gitignored `.env.production`. On a new machine or CI, create it first:

```bash
echo 'NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=gSBPbpAerVlzfJAg94piKxCZr73fjpV0VQDD-E9eTDI' > .env.production
```

- No secrets are configured. Runtime variables are in `wrangler.jsonc` under `vars`.

## Deploy

Always use `opennextjs-cloudflare deploy`, never plain `wrangler deploy`. The OpenNext command also uploads the prerendered pages (about 186 entries) into the R2 cache.

Deploy to the staging Worker first:

```bash
npx wrangler whoami                          # must show the account that owns appquran.com
npm run cf:build                             # build with OpenNext
npx opennextjs-cloudflare deploy --env staging
# test https://appquran-staging.quran-app-v1.workers.dev (Googlebot checks below;
# a second request to a content page must show a cache HIT)
npx opennextjs-cloudflare deploy             # production
npx wrangler delete --name appquran-staging --force   # remove the public test copy
```

The `staging` env in `wrangler.jsonc` has `workers_dev: true`, `routes: []`, its own self-reference service, and shares the cache bucket (same build shares entries, a different build uses separate keys).

Test locally on workerd before deploying:

```bash
npm run cf:preview
```

## Code differences from the Vercel version

- Next upgraded 16.1.3 to 16.4.6.
- npm override pins `cookie@0.7.2` under `@opennextjs/aws`. Reason: adapter bug, any request with a Cookie header returned 500. When upstream fixes it, remove the override and re-test with a Cookie header.
- Vercel Analytics and Speed Insights render only when `process.env.VERCEL` is set.
- `runtime = 'edge'` removed from `app/opengraph-image.tsx` and `app/twitter-image.tsx` (the adapter does not support edge runtime).
- `limits.cpu_ms: 5000` in `wrangler.jsonc` caps CPU per request.

## Known limitations

- `proxy.ts` (Next 16 Node middleware) is "experimental" in the adapter. All redirect tests passed.
- next/image optimization of remote Wikimedia images returns 403 through the adapter. No page uses it today.
- Static assets served by the assets binding do not get the `next.config` security headers. Pages do.
- Redirects use relative `Location` headers, except www to apex.
- One Jest failure (SettingsSidebar "opens and closes via header icon") also fails on origin/master. Not caused by this work.

## Caching (live since 2026-11-25)

Caching went live in production on 2026-11-25 (Worker version `708e1249-2169-45ca-91f5-2d5da0a02798`). The previous uncached version was `92261336-8113-4242-8efb-b6c891c570c2`.

How it works:

- Pages live under `app/[lang]/`. The UI language comes from the URL, so surah, verse, tafsir, juz and about pages are ISR: `revalidate` 1 day plus stale-while-revalidate.
- `proxy.ts` rewrites unprefixed URLs to `/en/...` internally and runs before the cache, so cookie and Accept-Language redirects still work for cached pages.
- Routing rules (for example `usePublicPathname` instead of `usePathname`, never read `headers()` or `cookies()` in pages) are in `app/AGENTS.md`.

OpenNext cache config (`open-next.config.ts`):

- R2 incremental cache in bucket `appquran-opennext-cache` (binding `NEXT_INC_CACHE_R2_BUCKET`, location APAC), wrapped in a long-lived regional cache.
- Durable Object queue `DOQueueHandler` (binding `NEXT_CACHE_DO_QUEUE`, migration tag `v1`) for background revalidation.
- Cache interception is on: cached pages are served without booting Next.
- No tag cache: the app never calls `revalidateTag` or `revalidatePath`.

Bucket lifecycle and keys:

- The bucket has a lifecycle rule `expire-30d`: objects are deleted 30 days after their last write.
- Keys look like `<prefix>/<buildId>/<hash>`. Every deploy starts with a cold cache, except the prerendered entries uploaded by `opennextjs-cloudflare deploy`. Old builds' entries expire through the lifecycle rule.

Measured behaviour:

- A page's first visit takes about 1-2 s (mostly the upstream Quran API). Stored pages answer in 0.06-0.2 s with header `x-opennext-cache: HIT` (or `x-nextjs-cache: HIT`).
- A request right after the first render may still say MISS, because the write finishes a moment later.

Upstream failures:

- Content loaders throw instead of rendering a degraded page. A first render then returns 500 and is not stored.
- An already stored page keeps being served (stale). Revalidation retries about every 30 s while the page is requested.

Favicon: it lives in `public/favicon.ico`. OpenNext stores `image/x-icon` as text and served it corrupted from the cache when it was an app route.

## Costs and safety

- Workers Paid includes 10M requests and 30M CPU-ms per month.
- Extra: $0.30 per million requests, $0.02 per million CPU-ms.
- Static asset requests are free. There is no bandwidth fee.
- A usage billing email alert is set in Cloudflare Notifications.
- R2 storage is roughly 0.2-0.3 MB per stored page (about 12-17 GB for 57k pages). 10 GB/month is free, then $0.015 per GB-month.
- R2 operations after the free 1M Class A and 10M Class B per month: Class A $4.50/M, Class B $0.36/M.
- Durable Object requests: $0.15/M on Workers Paid.
- A billing budget alert "Account spend reached $15 (appquran Workers)" emails the account owner.
- Optional Workers spending limit: it blocks all invocations at a threshold, so the site goes down. Use it only as a high safety net.

## DNS and the switch

Before the switch, both records were DNS-only (grey cloud) in the Cloudflare zone `appquran.com`:

| Name | Type | Value |
| --- | --- | --- |
| `appquran.com` | A | `76.76.21.21` |
| `www.appquran.com` | CNAME | `cname.vercel-dns.com` |

The switch replaces these with Worker Custom Domains for `appquran.com` and `www.appquran.com`:
Workers, then `appquran`, then Settings, then Domains & Routes. `proxy.ts` redirects www to the apex with 308.

## Rollback

Between Worker versions: `npx wrangler rollback`. It works between versions that have the Durable Object class. Rolling back to a version from before the `v1` Durable Object migration (such as `92261336...`) may be refused by Cloudflare. In that case fix forward, or redeploy an older commit that still exports the class.

### Rollback to Vercel

This works only after the Vercel project is unpaused or moved to Pro.

1. Remove the two Worker custom domains.
2. Re-create the two DNS records above, as DNS-only.
3. Check that Vercel answers:

```bash
curl -sI https://appquran.com/ | grep -i '^server'   # expect: server: Vercel
```

## Checks after the switch or a deploy

Set `H=https://appquran.com` (or the workers.dev URL for a pre-switch test) and use a Googlebot user agent.

```bash
H=https://appquran.com
UA='Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
c() { curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' -A "$UA" "$@"; }

c $H/2/255                                   # 308 /surah/al-baqarah/255
c $H/en/surah/ya-sin                         # 308 /surah/ya-sin
c $H/surah/ya-sin/                           # 308 (trailing slash removed)
c -H 'Accept-Language: bn' $H/surah/ya-sin   # 307 /bn/surah/ya-sin
c -H 'Cookie: ui-language=bn' $H/surah/ya-sin  # 307 /bn/surah/ya-sin
c -H 'Cookie: theme=dark' $H/surah/ya-sin    # 200 (catches the cookie bug)
c $H/surah/al-baqarah/999                    # 404
c https://www.appquran.com/                  # 308 to apex

# Page content
curl -s -A "$UA" $H/surah/al-baqarah | grep -oE 'data-verse-key="[0-9]+:[0-9]+"' | sort -u | wc -l   # 286
curl -s -A "$UA" $H/bn/surah/ya-sin | grep -o '<html[^>]*lang="bn"'       # found
curl -s -A "$UA" $H/bn/surah/ya-sin | grep -oE 'data-verse-key="[0-9]+:[0-9]+"' | sort -u | wc -l   # 83
curl -s -A "$UA" $H/ar/surah/ya-sin | grep -o '<html[^>]*dir="rtl"'      # found
curl -s -A "$UA" $H/surah/ya-sin | grep -o 'rel="canonical" href="[^"]*"' # https://appquran.com/...
curl -s -A "$UA" $H/surah/ya-sin | grep -oi 'hreflang="[^"]*"' | sort -u | wc -l   # 6
curl -s -A "$UA" $H/surah/ya-sin | grep -o 'google-site-verification'     # present

# Cache (request twice; the second answer must show a HIT header)
for i in 1 2; do curl -sI -A "$UA" $H/surah/ya-sin | grep -i -E 'x-opennext-cache|x-nextjs-cache'; done
curl -s -o /dev/null -w '%{size_download} %{content_type}\n' $H/favicon.ico   # 4696 image/x-icon (or similar icon type)
curl -s -A "$UA" $H/hi/tafsir/al-baqarah/255 | grep -o '<meta name="robots" content="[^"]*"'   # noindex, follow

# Sitemaps
curl -s $H/sitemap.xml | grep -o '<loc>' | wc -l                  # 10 children
curl -s $H/sitemaps/verses-en.xml | grep -o '<loc>' | wc -l       # 6236

# Must all return 200
for p in /robots.txt /llms.txt /opengraph-image /64a6b60346f4c880149e28cb2fd090a8.txt /sw.js; do
  echo -n "$p "; c $H$p
done
```

Also open one page in a browser and check that fonts load (DevTools, Network, filter "font": status 200).

## After the DNS switch

- Consider `"workers_dev": false` in `wrangler.jsonc` so the workers.dev copy is not crawled. Canonicals already point to `appquran.com`.
- Add Cloudflare Web Analytics for real-user speed data. Vercel Speed Insights no longer collects.
- Nothing to resubmit in Search Console or Bing. The domain and URLs are unchanged.
