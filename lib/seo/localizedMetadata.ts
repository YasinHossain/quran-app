import { ENABLED_LANGUAGES, type UiLanguageCode } from '@/app/shared/i18n/languageRegistry';
import { setLocaleInPathname } from '@/app/shared/i18n/localeRouting';
import { SITE_NAME, absoluteUrl } from '@/lib/seo/site';

import type { Metadata } from 'next';

/** Absolute URL of `path` (an unprefixed route such as `/surah/36`) in `locale`. */
export function localizedUrl(path: string, locale: UiLanguageCode): string {
  return absoluteUrl(setLocaleInPathname(path, locale));
}

/**
 * hreflang map for `path`: one entry per enabled language plus `x-default` (the unprefixed,
 * default-language URL). Shared by page metadata and the sitemap.
 */
export function buildHreflangAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(
      ENABLED_LANGUAGES.map((language) => [language.hreflang, localizedUrl(path, language.code)])
    ),
    'x-default': absoluteUrl(path),
  };
}

/** Self-referencing canonical for the request's locale, with hreflang alternates. */
export function buildLocalizedAlternates(
  path: string,
  locale: UiLanguageCode
): NonNullable<Metadata['alternates']> {
  return {
    canonical: localizedUrl(path, locale),
    languages: buildHreflangAlternates(path),
  };
}

/**
 * Metadata for an indexable page that exists in every enabled language: title, description,
 * canonical + hreflang, and matching OpenGraph/Twitter text.
 */
export function buildLocalizedPageMetadata(input: {
  path: string;
  locale: UiLanguageCode;
  title: string;
  description: string;
  /** Use the title as-is instead of the root `%s | Site` template. */
  absoluteTitle?: boolean;
}): Metadata {
  const { path, locale, title, description, absoluteTitle = false } = input;
  const alternates = buildLocalizedAlternates(path, locale);
  const socialTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates,
    openGraph: {
      title: socialTitle,
      description,
      url: alternates.canonical as string,
    },
    twitter: {
      title: socialTitle,
      description,
    },
  };
}
