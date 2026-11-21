#!/usr/bin/env node
/**
 * IndexNow submission (https://www.indexnow.org/documentation).
 *
 * The key file is served at https://appquran.com/64a6b60346f4c880149e28cb2fd090a8.txt (public/64a6b60346f4c880149e28cb2fd090a8.txt).
 *
 * Usage:
 *   npm run seo:indexnow -- https://appquran.com/surah/1 https://appquran.com/tafsir/1/1
 *   npm run seo:indexnow -- --sitemap            # all <loc> entries of /sitemap.xml (follows sitemap indexes)
 *   npm run seo:indexnow -- --sitemap --dry-run  # print the payload(s) without submitting
 *
 * Submit after a deploy that adds or changes many URLs. URLs are sent in batches of <= 10,000.
 */

const HOST = 'appquran.com';
const KEY = '64a6b60346f4c880149e28cb2fd090a8';
const KEY_LOCATION = `https://${HOST}/64a6b60346f4c880149e28cb2fd090a8.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const BATCH_SIZE = 10000;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const useSitemap = args.includes('--sitemap');
const explicitUrls = args.filter((a) => !a.startsWith('--'));

async function collectSitemapUrls(url, seen = new Set()) {
  if (seen.has(url)) return [];
  seen.add(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) =>
    m[1].replace(/&amp;/g, '&')
  );
  if (!/<sitemapindex[\s>]/.test(xml)) return locs;
  const nested = [];
  for (const loc of locs) nested.push(...(await collectSitemapUrls(loc, seen)));
  return nested;
}

async function main() {
  let urls = [...explicitUrls];
  if (useSitemap) urls.push(...(await collectSitemapUrls(SITEMAP_URL)));
  urls = [...new Set(urls)];

  if (urls.length === 0) {
    console.error('No URLs. Pass URLs as arguments or use --sitemap.');
    process.exit(1);
  }
  const offHost = urls.filter((u) => new URL(u).hostname !== HOST);
  if (offHost.length > 0) {
    console.error(`URLs must be on ${HOST}: ${offHost.slice(0, 3).join(', ')}`);
    process.exit(1);
  }

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const payload = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls.slice(i, i + BATCH_SIZE),
    };
    if (dryRun) {
      console.log(JSON.stringify(payload, null, 2));
      continue;
    }
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });
    console.log(
      `Batch ${i / BATCH_SIZE + 1}: ${payload.urlList.length} URLs -> HTTP ${res.status}`
    );
    if (!res.ok && res.status !== 202) process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
