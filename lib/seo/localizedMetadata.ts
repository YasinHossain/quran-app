import { INDEXABLE_LANGUAGES, type UiLanguageCode } from '@/app/shared/i18n/languageRegistry';
import { setLocaleInPathname } from '@/app/shared/i18n/localeRouting';
import { SITE_NAME, absoluteUrl } from '@/lib/seo/site';

import type { Metadata } from 'next';

/** Dimensions of the shared `app/opengraph-image` and `app/twitter-image` routes. */
const SOCIAL_IMAGE = { width: 1200, height: 630, alt: `${SITE_NAME} – Quran app` };

/** Absolute URL of `path` (an unprefixed route such as `/surah/36`) in `locale`. */
export function localizedUrl(path: string, locale: UiLanguageCode): string {
  return absoluteUrl(setLocaleInPathname(path, locale));
}

type HreflangLanguages = ReadonlyArray<{ code: UiLanguageCode; hreflang: string }>;

/**
 * hreflang map for `path`: one entry per language in `languages` (default: every indexable one)
 * plus `x-default` (the unprefixed, default-language URL). Shared by page metadata and the sitemap.
 */
export function buildHreflangAlternates(
  path: string,
  languages: HreflangLanguages = INDEXABLE_LANGUAGES
): Record<string, string> {
  return {
    ...Object.fromEntries(
      languages.map((language) => [language.hreflang, localizedUrl(path, language.code)])
    ),
    'x-default': absoluteUrl(path),
  };
}

/**
 * Self-referencing canonical for the request's locale, with hreflang alternates. A locale outside
 * `languages` keeps its self canonical (it is `noindex`, not a duplicate of another URL).
 */
export function buildLocalizedAlternates(
  path: string,
  locale: UiLanguageCode,
  languages: HreflangLanguages = INDEXABLE_LANGUAGES
): NonNullable<Metadata['alternates']> {
  return {
    canonical: localizedUrl(path, locale),
    languages: buildHreflangAlternates(path, languages),
  };
}

/**
 * Metadata for a page that exists in every enabled language: title, description, canonical +
 * hreflang, and matching OpenGraph/Twitter text. Indexable only in `languages`.
 */
export function buildLocalizedPageMetadata(input: {
  path: string;
  locale: UiLanguageCode;
  title: string;
  description: string;
  /** Use the title as-is instead of the root `%s | Site` template. */
  absoluteTitle?: boolean;
  /**
   * Languages whose version of this page is indexed (default: every indexable one). A request in
   * another language (not indexable, or a duplicate such as a fallback tafsir) is
   * `noindex, follow` and not listed as an alternate.
   */
  languages?: HreflangLanguages;
}): Metadata {
  const {
    path,
    locale,
    title,
    description,
    absoluteTitle = false,
    languages = INDEXABLE_LANGUAGES,
  } = input;
  const alternates = buildLocalizedAlternates(path, locale, languages);
  const isOwnVersion = languages.some((language) => language.code === locale);
  const socialTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates,
    ...(isOwnVersion ? {} : { robots: { index: false, follow: true } }),
    // A page's `openGraph`/`twitter` replace the root layout's, so the shared site image (not a
    // per-page image) is repeated here.
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      url: alternates.canonical as string,
      images: [{ url: '/opengraph-image', ...SOCIAL_IMAGE }],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [{ url: '/twitter-image', alt: SOCIAL_IMAGE.alt }],
    },
  };
}
