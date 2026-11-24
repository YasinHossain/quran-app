#!/usr/bin/env node
/**
 * Warms the Cloudflare page cache after a deploy (see docs/hosting-cloudflare.md).
 *
 * Reads the sitemap index, keeps the surah and juz reader pages of every indexed language, and
 * requests each one so it is rendered and stored before crawlers and visitors arrive. Requests go
 * out without cookies or Accept-Language, so the proxy serves the URL's own language.
 *
 * Usage:
 *   npm run cf:warm
 *   npm run cf:warm -- --base https://appquran-staging.quran-app-v1.workers.dev
 *   npm run cf:warm -- --match '/juz/' --limit 10 --concurrency 2
 *
 * Options:
 *   --base <url>        Site origin (default https://appquran.com). Sitemap URLs are rewritten onto it.
 *   --match <regex>     Only warm paths matching this regex (applied after the default filter).
 *   --limit <n>         Warm at most n pages.
 *   --concurrency <n>   Parallel requests (default 3).
 */

const USER_AGENT = 'appquran-cache-warmer';
/** Surah reader (`/surah/<slug>`) and juz (`/juz/<n>`) pages, with or without a language prefix. */
const DEFAULT_PATH_PATTERN = /^(?:\/[a-z]{2})?\/(?:surah\/[^/]+|juz\/\d+)$/;
const CACHE_HEADERS = ['x-opennext-cache', 'x-nextjs-cache', 'cf-cache-status'];

function parseArgs(argv) {
  const options = { base: 'https://appquran.com', match: null, limit: Infinity, concurrency: 3 };
  for (let i = 0; i < argv.length; i += 1) {
    const name = argv[i];
    const value = argv[i + 1];
    if (value === undefined) throw new Error(`Missing value for ${name}`);
    if (name === '--base') options.base = value.replace(/\/+$/, '');
    else if (name === '--match') options.match = new RegExp(value);
    else if (name === '--limit') options.limit = Number(value);
    else if (name === '--concurrency') options.concurrency = Math.max(1, Number(value));
    else throw new Error(`Unknown option ${name}`);
    i += 1;
  }
  if (!Number.isFinite(options.concurrency)) throw new Error('--concurrency must be a number');
  return options;
}

async function fetchLocs(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) =>
    m[1].replace(/&amp;/g, '&')
  );
  return { locs, isIndex: /<sitemapindex[\s>]/.test(xml) };
}

/** Collects page paths from the sitemap index and its children (skipping per-verse/tafsir maps). */
async function collectPaths(base) {
  const index = await fetchLocs(`${base}/sitemap.xml`);
  const children = index.isIndex ? index.locs : [];
  const pages = index.isIndex ? [] : index.locs;
  // Surah and juz pages are listed in the core sitemap; verse and tafsir sitemaps are large and
  // only hold verse-level URLs, so they are skipped.
  for (const child of children) {
    const childPath = new URL(child).pathname;
    if (/\/(?:verses|tafsir)-[a-z]+\.xml$/.test(childPath)) continue;
    pages.push(...(await fetchLocs(`${base}${childPath}`)).locs);
  }
  return [...new Set(pages.map((loc) => new URL(loc).pathname))];
}

async function warm(base, path) {
  const started = performance.now();
  try {
    const res = await fetch(`${base}${path}`, {
      headers: { 'User-Agent': USER_AGENT },
      redirect: 'manual',
    });
    await res.arrayBuffer();
    const hit = CACHE_HEADERS.some((h) => /hit/i.test(res.headers.get(h) ?? ''));
    return { path, status: res.status, ms: performance.now() - started, hit };
  } catch (error) {
    return { path, status: 'error', ms: performance.now() - started, hit: false, error };
  }
}

function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  return sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)];
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  let paths = (await collectPaths(options.base)).filter((p) => DEFAULT_PATH_PATTERN.test(p));
  if (options.match) paths = paths.filter((p) => options.match.test(p));
  paths = paths.slice(0, options.limit);
  console.log(
    `Warming ${paths.length} pages on ${options.base} (concurrency ${options.concurrency})`
  );

  const results = [];
  let next = 0;
  const worker = async () => {
    while (next < paths.length) {
      const result = await warm(options.base, paths[next++]);
      results.push(result);
      if (result.status !== 200) console.log(`  ${result.status} ${result.path}`);
      if (results.length % 50 === 0) console.log(`  ${results.length}/${paths.length}`);
    }
  };
  const started = performance.now();
  await Promise.all(Array.from({ length: options.concurrency }, worker));

  const statusCounts = {};
  for (const r of results) statusCounts[r.status] = (statusCounts[r.status] ?? 0) + 1;
  const times = results.map((r) => r.ms).sort((a, b) => a - b);
  const hits = results.filter((r) => r.hit).length;
  console.log(
    `\nDone: ${results.length} pages in ${((performance.now() - started) / 1000).toFixed(1)} s`
  );
  console.log(`Status: ${JSON.stringify(statusCounts)}`);
  console.log(
    `Time: p50 ${percentile(times, 50).toFixed(0)} ms, p90 ${percentile(times, 90).toFixed(0)} ms`
  );
  console.log(`Cache HIT header: ${hits}/${results.length}`);
  if (results.some((r) => r.status !== 200)) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
