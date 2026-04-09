import { absoluteUrl } from '@/lib/seo/site';

import type { MetadataRoute } from 'next';

/**
 * Stable last-modified date — only update this when site content actually changes.
 * Using `new Date()` tells Google "everything changed" on every deploy, reducing crawl efficiency.
 */
const CONTENT_LAST_MODIFIED = new Date('2026-02-17');

const buildNumericRoutes = (prefix: string, from: number, to: number): string[] =>
  Array.from({ length: to - from + 1 }, (_, index) => `${prefix}/${from + index}`);

interface SitemapEntry {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: SitemapEntry[] = [
    // Core pages
    { path: '/', priority: 1.0, changeFrequency: 'daily' },
    { path: '/surah', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/tafsir', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/juz', priority: 0.6, changeFrequency: 'monthly' },

    // All 114 surahs — highest content priority
    ...buildNumericRoutes('/surah', 1, 114).map((path) => ({
      path,
      priority: 0.9,
      changeFrequency: 'weekly' as const,
    })),

    // Tafsir entry points per surah (first verse)
    ...buildNumericRoutes('/tafsir', 1, 114).map((prefix) => ({
      path: `${prefix}/1`,
      priority: 0.7,
      changeFrequency: 'weekly' as const,
    })),

    // Juz pages
    ...buildNumericRoutes('/juz', 1, 30).map((path) => ({
      path,
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    })),

    // Legal / info pages
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  ];

  return entries.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    lastModified: CONTENT_LAST_MODIFIED,
    changeFrequency,
    priority,
  }));
}
