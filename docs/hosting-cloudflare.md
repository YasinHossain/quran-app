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

```bash
npx wrangler whoami          # must show the account that owns appquran.com
npm run cf:build             # build with OpenNext
npx opennextjs-cloudflare deploy
```

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

## Caching (pending)

Pages currently render on every request, because the root layout reads `headers()` and `cookies()`. The branch `hosting/cloudflare-cache` is in progress. It merges `perf/lang-segment` (the `app/[lang]` route refactor) and adds ISR with an R2 incremental cache. It is not deployed. Do not copy config from this doc for it.

## Costs and safety

- Workers Paid includes 10M requests and 30M CPU-ms per month.
- Extra: $0.30 per million requests, $0.02 per million CPU-ms.
- Static asset requests are free. There is no bandwidth fee.
- A usage billing email alert is set in Cloudflare Notifications.
- Optional Workers spending limit: it blocks all invocations at a threshold, so the site goes down. Use it only as a high safety net.

## DNS and the switch

Before the switch, both records were DNS-only (grey cloud) in the Cloudflare zone `appquran.com`:

| Name | Type | Value |
| --- | --- | --- |
| `appquran.com` | A | `76.76.21.21` |
| `www.appquran.com` | CNAME | `cname.vercel-dns.com` |

The switch replaces these with Worker Custom Domains for `appquran.com` and `www.appquran.com`:
Workers, then `appquran`, then Settings, then Domains & Routes. `proxy.ts` redirects www to the apex with 308.

## Rollback to Vercel

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
curl -s -A "$UA" $H/surah/al-baqarah | grep -o 'data-verse-key' | wc -l   # 286
curl -s -A "$UA" $H/bn/surah/ya-sin | grep -o '<html[^>]*lang="bn"'       # found
curl -s -A "$UA" $H/bn/surah/ya-sin | grep -o 'data-verse-key' | wc -l   # 83
curl -s -A "$UA" $H/ar/surah/ya-sin | grep -o '<html[^>]*dir="rtl"'      # found
curl -s -A "$UA" $H/surah/ya-sin | grep -o 'rel="canonical" href="[^"]*"' # https://appquran.com/...
curl -s -A "$UA" $H/surah/ya-sin | grep -o 'hreflang=' | wc -l            # 6
curl -s -A "$UA" $H/surah/ya-sin | grep -o 'google-site-verification'     # present

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
