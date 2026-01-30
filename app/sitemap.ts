import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/lib/seo/site';

const buildNumericRoutes = (prefix: string, from: number, to: number): string[] =>
  Array.from({ length: to - from + 1 }, (_, index) => `${prefix}/${from + index}`);

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes = [
    '/',
    '/surah',
    '/tafsir',
    '/privacy',
    '/terms',
    ...buildNumericRoutes('/surah', 1, 114),
    // Index the canonical Tafsir entry point per surah (first verse).
    ...buildNumericRoutes('/tafsir', 1, 114).map((path) => `${path}/1`),
  ];

  return routes.map((path) => ({
    url: absoluteUrl(path),
    lastModified,
  }));
}

