import { buildSitemapEntries } from '@/lib/seo/sitemapEntries';

import type { MetadataRoute } from 'next';

/**
 * Single sitemap (about 1,300 URLs today). Entries come from `SITEMAP_SECTIONS`; when verse pages
 * push the total past 50,000, switch to `generateSitemaps` over those sections and point
 * robots.txt at the resulting files (or a sitemap index).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries();
}
