import {
  ENABLED_LANGUAGES,
  TAFSIR_LANGUAGES,
  type UiLanguageCode,
} from '@/app/shared/i18n/languageRegistry';
import { buildSurahRoute, buildTafsirRoute, buildVerseRoute } from '@/app/shared/navigation/routes';
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

/** A named group of routes, all listed in the `core` child sitemap. */
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
      { path: '/about', priority: 0.4, changeFrequency: 'monthly', localized: true },
      // Legal pages are English-only; their localized URLs canonicalize to English.
      { path: '/privacy', priority: 0.3, changeFrequency: 'yearly', localized: false },
      { path: '/terms', priority: 0.3, changeFrequency: 'yearly', localized: false },
    ],
  },
  {
    id: 'surah',
    routes: () =>
      range(1, 114).map((id) => ({
        path: buildSurahRoute(id),
        priority: 0.9,
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

/*
 * Sitemap index (`/sitemap.xml`) and its children (`/sitemaps/<id>.xml`):
 * - `core`: home, indexes, surahs and juz in every language (~750 URLs).
 * - `verses-<lang>`: every verse page (`/surah/s/v`) in one language (6,236 URLs each).
 * - `tafsir-<lang>`: every tafsir page (`/tafsir/s/v`) in a language with its own tafsir.
 * Each child stays far below the 50,000-URL / 50MB limits (~4MB with hreflang alternates).
 */

/** Verse counts indexed by surah (index 0 is surah 1), from chapter data. */
type VerseCounts = ReadonlyArray<number>;

/**
 * Languages whose tafsir pages are listed (`hasOwnTafsir` in the registry). A language that falls
 * back to another language's tafsir (Hindi uses the English Ibn Kathir) would only list
 * duplicates; its tafsir pages are `noindex` and left out of the tafsir hreflang alternates.
 */
export const TAFSIR_SITEMAP_LANGUAGES: ReadonlyArray<UiLanguageCode> = TAFSIR_LANGUAGES.map(
  (language) => language.code
);

export const SITEMAP_CHILD_IDS: ReadonlyArray<string> = [
  'core',
  ...ENABLED_LANGUAGES.map((language) => `verses-${language.code}`),
  ...TAFSIR_SITEMAP_LANGUAGES.map((code) => `tafsir-${code}`),
];

const forEachVerse = <T>(verseCounts: VerseCounts, map: (s: number, v: number) => T): T[] =>
  verseCounts.flatMap((count, index) => range(1, count).map((verse) => map(index + 1, verse)));

/** Entries of one localized per-verse route (verse or tafsir pages) in one language. */
function buildPerVerseEntries(
  locale: UiLanguageCode,
  verseCounts: VerseCounts,
  buildPath: (surahId: number, verseId: number) => string,
  priority: number,
  languages: Parameters<typeof buildHreflangAlternates>[1] = ENABLED_LANGUAGES
): MetadataRoute.Sitemap {
  return forEachVerse(verseCounts, (surahId, verseId) => {
    const path = buildPath(surahId, verseId);
    return {
      url: localizedUrl(path, locale),
      lastModified: SEO_CONTENT_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority,
      alternates: { languages: buildHreflangAlternates(path, languages) },
    };
  });
}

const isEnabledLanguage = (code: string): code is UiLanguageCode =>
  ENABLED_LANGUAGES.some((language) => language.code === code);

/** Entries of child sitemap `id`, or `null` for an unknown id. */
export function buildSitemapChild(
  id: string,
  verseCounts: VerseCounts
): MetadataRoute.Sitemap | null {
  if (!SITEMAP_CHILD_IDS.includes(id)) return null;
  if (id === 'core') return buildSitemapEntries();

  const [kind, code = ''] = id.split('-');
  if (!isEnabledLanguage(code)) return null;
  return kind === 'verses'
    ? buildPerVerseEntries(code, verseCounts, buildVerseRoute, 0.7)
    : buildPerVerseEntries(code, verseCounts, buildTafsirRoute, 0.6, TAFSIR_LANGUAGES);
}

export const sitemapChildUrl = (id: string): string => absoluteUrl(`/sitemaps/${id}.xml`);
