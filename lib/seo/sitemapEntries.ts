import { ENABLED_LANGUAGES } from '@/app/shared/i18n/languageRegistry';
import { buildHreflangAlternates, localizedUrl } from '@/lib/seo/localizedMetadata';
import { absoluteUrl } from '@/lib/seo/site';

import type { MetadataRoute } from 'next';

/**
 * Last real change to indexed content (Quran text/translations served, page structure, metadata).
 * Bump it when that content changes; do not derive it from the build or request time, or every
 * deploy tells search engines that all pages changed.
 */
export const SEO_CONTENT_LAST_MODIFIED = new Date('2026-11-21T00:00:00Z');

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

interface SitemapRoute {
  /** Unprefixed (default-language) path. */
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
  /** Page exists in every enabled language (self canonical + hreflang). */
  localized: boolean;
}

/**
 * A named group of routes. Sections are the unit for splitting into several sitemap files with
 * `generateSitemaps` once the total passes the 50,000-URL limit (Phase 2 verse pages).
 */
export interface SitemapSection {
  id: string;
  routes: () => SitemapRoute[];
}

const range = (from: number, to: number): number[] =>
  Array.from({ length: to - from + 1 }, (_, index) => from + index);

export const SITEMAP_SECTIONS: ReadonlyArray<SitemapSection> = [
  {
    id: 'core',
    routes: () => [
      { path: '/', priority: 1.0, changeFrequency: 'daily', localized: true },
      { path: '/surah', priority: 0.9, changeFrequency: 'weekly', localized: true },
      { path: '/tafsir', priority: 0.8, changeFrequency: 'weekly', localized: true },
      { path: '/juz', priority: 0.6, changeFrequency: 'monthly', localized: true },
      // Legal pages are English-only; their localized URLs canonicalize to English.
      { path: '/privacy', priority: 0.3, changeFrequency: 'yearly', localized: false },
      { path: '/terms', priority: 0.3, changeFrequency: 'yearly', localized: false },
    ],
  },
  {
    id: 'surah',
    routes: () =>
      range(1, 114).map((id) => ({
        path: `/surah/${id}`,
        priority: 0.9,
        changeFrequency: 'weekly' as const,
        localized: true,
      })),
  },
  {
    id: 'tafsir',
    // Tafsir entry point per surah (first verse).
    routes: () =>
      range(1, 114).map((id) => ({
        path: `/tafsir/${id}/1`,
        priority: 0.7,
        changeFrequency: 'weekly' as const,
        localized: true,
      })),
  },
  {
    id: 'juz',
    routes: () =>
      range(1, 30).map((id) => ({
        path: `/juz/${id}`,
        priority: 0.6,
        changeFrequency: 'monthly' as const,
        localized: true,
      })),
  },
];

/** One `<url>` per language version, each listing every version as an hreflang alternate. */
export function buildSitemapEntries(
  sections: ReadonlyArray<SitemapSection> = SITEMAP_SECTIONS
): MetadataRoute.Sitemap {
  return sections.flatMap((section) =>
    section.routes().flatMap(({ path, priority, changeFrequency, localized }) => {
      if (!localized) {
        return [
          {
            url: absoluteUrl(path),
            lastModified: SEO_CONTENT_LAST_MODIFIED,
            changeFrequency,
            priority,
          },
        ];
      }
      const languages = buildHreflangAlternates(path);
      return ENABLED_LANGUAGES.map((language) => ({
        url: localizedUrl(path, language.code),
        lastModified: SEO_CONTENT_LAST_MODIFIED,
        changeFrequency,
        priority,
        alternates: { languages },
      }));
    })
  );
}
