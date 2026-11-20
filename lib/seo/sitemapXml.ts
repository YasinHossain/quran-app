import type { MetadataRoute } from 'next';

/**
 * XML for the sitemap route handlers. Next's metadata `sitemap.ts` cannot serve a sitemap index at
 * `/sitemap.xml` (the URL already submitted to search engines), so the index and its children are
 * route handlers that render the same `MetadataRoute.Sitemap` entries.
 */

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const toIsoDate = (value: string | Date | undefined): string | null => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

function renderUrl(entry: MetadataRoute.Sitemap[number]): string {
  const lines = [`<loc>${escapeXml(entry.url)}</loc>`];
  for (const [hreflang, href] of Object.entries(entry.alternates?.languages ?? {})) {
    if (!href) continue;
    lines.push(
      `<xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(String(href))}" />`
    );
  }
  const lastModified = toIsoDate(entry.lastModified);
  if (lastModified) lines.push(`<lastmod>${lastModified}</lastmod>`);
  if (entry.changeFrequency) lines.push(`<changefreq>${entry.changeFrequency}</changefreq>`);
  if (typeof entry.priority === 'number') lines.push(`<priority>${entry.priority}</priority>`);
  return `<url>\n${lines.join('\n')}\n</url>`;
}

export function renderSitemapXml(entries: MetadataRoute.Sitemap): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries.map(renderUrl),
    '</urlset>',
    '',
  ].join('\n');
}

export function renderSitemapIndexXml(
  sitemaps: ReadonlyArray<{ url: string; lastModified?: Date | undefined }>
): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemaps.map(({ url, lastModified }) => {
      const lastmod = toIsoDate(lastModified);
      return `<sitemap>\n<loc>${escapeXml(url)}</loc>${lastmod ? `\n<lastmod>${lastmod}</lastmod>` : ''}\n</sitemap>`;
    }),
    '</sitemapindex>',
    '',
  ].join('\n');
}

export const SITEMAP_XML_HEADERS = {
  'Content-Type': 'application/xml; charset=utf-8',
} as const;
