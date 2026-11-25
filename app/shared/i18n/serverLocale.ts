import 'server-only';

import { notFound } from 'next/navigation';

import { getUiLanguageContentDefaults } from '@/app/providers/uiLanguageContentDefaults';
import { ensureLanguageCode, type LanguageCode } from '@/lib/text/languageCodes';

import { loadUiCommonJson } from './loadUiResources';
import { DEFAULT_UI_LANGUAGE, isUiLanguageCode, type UiLanguageCode } from './uiLanguages';

import type { FullTextTitleTemplates } from '@/app/shared/reader/ReaderFullText';
import type { TafsirMetadataTemplates } from '@/lib/seo/tafsirMetadata';
import type { VerseMetadataTemplates } from '@/lib/seo/verseMetadata';
import type { Chapter } from '@/types';

/** Route params of every page under `app/[lang]`. */
export type LangParams = Promise<{ lang: string }>;

/**
 * UI language of a page, from its `[lang]` segment. `proxy.ts` serves unprefixed URLs from `/en/...`
 * and `/<code>/...` as is, so this is the URL's language; anything else 404s. Server components
 * and `generateMetadata` pass it down to render the content defaults the client reader starts with.
 */
export async function getPageUiLanguage(params: LangParams): Promise<UiLanguageCode> {
  const { lang } = await params;
  if (!isUiLanguageCode(lang)) notFound();
  return lang;
}

type Vars = Record<string, string | number>;

export interface ServerTranslator {
  locale: UiLanguageCode;
  /** Looks up a `common.json` key (falling back to English) and fills `{{name}}` placeholders. */
  t: (key: string, vars?: Vars) => string;
  /** Localised surah name from `surah_names`, or `fallback`. */
  surahName: (surahId: number, fallback?: string) => string;
  /**
   * Surah name for page text and metadata. English keeps the API's `name_simple` (what indexed
   * English titles already use); other languages use `surah_names`.
   */
  chapterName: (chapter: Pick<Chapter, 'id' | 'name_simple'>) => string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

// Placeholders may carry an i18next format (`{{number, number}}`); metadata uses plain digits.
const PLACEHOLDER = /\{\{\s*([\w.]+)\s*(?:,[^}]*)?\}\}/g;

export function interpolate(template: string, vars: Vars = {}): string {
  return template.replace(PLACEHOLDER, (match, name: string) =>
    name in vars ? String(vars[name]) : match
  );
}

export async function getServerTranslator(locale: UiLanguageCode): Promise<ServerTranslator> {
  const [fallback, localized] = await Promise.all([
    loadUiCommonJson(DEFAULT_UI_LANGUAGE),
    locale === DEFAULT_UI_LANGUAGE ? Promise.resolve(null) : loadUiCommonJson(locale),
  ]);

  const lookup = (path: string): string | undefined => {
    for (const source of [localized, fallback]) {
      let node: unknown = source;
      for (const part of path.split('.')) {
        node = isRecord(node) ? node[part] : undefined;
      }
      if (typeof node === 'string' && node.length > 0) return node;
    }
    return undefined;
  };

  const surahName = (surahId: number, fallbackName?: string): string =>
    lookup(`surah_names.${surahId}`) ?? fallbackName ?? String(surahId);

  return {
    locale,
    t: (key, vars) => interpolate(lookup(key) ?? key, vars),
    surahName,
    chapterName: (chapter) =>
      locale === 'en' ? chapter.name_simple : surahName(chapter.id, chapter.name_simple),
  };
}

export interface ServerReaderDefaults {
  /** Translations the client reader starts with for this language (empty: Arabic only). */
  translationIds: number[];
  wordLang: LanguageCode;
  tafsirId: number;
}

/**
 * Reader content the server renders for a language. It must equal the client's initial settings
 * (`withUiLanguageContentDefaults`) so the server page is reused without a refetch.
 */
export function getServerReaderDefaults(locale: UiLanguageCode): ServerReaderDefaults {
  const defaults = getUiLanguageContentDefaults(locale);
  const fallbackTafsirId = getUiLanguageContentDefaults(DEFAULT_UI_LANGUAGE).tafsirIds[0] ?? 169;
  return {
    translationIds: [...defaults.translationIds],
    wordLang: ensureLanguageCode(defaults.wordLang),
    tafsirId: defaults.tafsirIds[0] ?? fallbackTafsirId,
  };
}

export function getFullTextTitleTemplates(translator: ServerTranslator): FullTextTitleTemplates {
  return {
    withTranslation: translator.t('reader_full_text_title'),
    arabicOnly: translator.t('reader_full_text_title_arabic'),
  };
}

export function getTafsirMetadataTemplates(translator: ServerTranslator): TafsirMetadataTemplates {
  return {
    title: translator.t('seo_tafsir_title'),
    titleFallback: translator.t('seo_tafsir_title_fallback'),
    descriptionFallback: translator.t('seo_tafsir_description_fallback'),
    tail: translator.t('seo_tafsir_description_tail'),
    tailShort: translator.t('seo_tafsir_description_tail_short'),
    tafsirName: translator.t('seo_default_tafsir_name'),
  };
}

export function getVerseMetadataTemplates(translator: ServerTranslator): VerseMetadataTemplates {
  return {
    title: translator.t('seo_verse_title'),
    titleFallback: translator.t('seo_verse_title_fallback'),
    descriptionFallback: translator.t('seo_verse_description_fallback'),
    tail: translator.t('seo_verse_description_tail'),
    tailShort: translator.t('seo_verse_description_tail_short'),
  };
}
