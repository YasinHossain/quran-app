import { apiFetch } from '@/lib/api/client';
import { Verse } from '@/types';

import { normalizeVerse, ApiVerse } from './normalize';

import type { LanguageCode } from '@/lib/text/languageCodes';

export interface PaginatedVerses {
  verses: Verse[];
  totalPages: number;
}

export interface FetchVersesOptions {
  type: 'by_chapter' | 'by_juz' | 'by_page';
  id: string | number;
  translationIds?: number | number[];
  page?: number;
  perPage?: number;
  wordLang?: LanguageCode;
  /** When true, fetches code_v2 and page_number fields for Tajweed V4 font rendering */
  tajweed?: boolean;
}

/**
 * Fetch verses grouped by chapter, juz or page and return pagination info.
 *
 * @param options Describes the verse grouping and pagination preferences.
 *
 * Handles single vs array translation IDs and normalizes API pagination
 * metadata, defaulting to one page when the server omits totals.
 */
export async function fetchVerses({
  type,
  id,
  translationIds,
  page = 1,
  perPage = 20,
  wordLang = 'en',
  tajweed = false,
}: FetchVersesOptions): Promise<PaginatedVerses> {
  const translationIdsArray = Array.isArray(translationIds)
    ? translationIds
    : typeof translationIds === 'number'
      ? [translationIds]
      : [];
  const filteredTranslationIds = translationIdsArray.filter((id) => Number.isFinite(id));
  const translationParam = filteredTranslationIds.length ? filteredTranslationIds.join(',') : null;

  // Include code_v2 and page_number when tajweed is enabled for V4 font rendering
  const wordFields = tajweed
    ? 'text_uthmani,text_indopak,code_v2,page_number'
    : 'text_uthmani,text_indopak';

  const data = await apiFetch<{
    verses: ApiVerse[];
    meta?: { total_pages: number };
    pagination?: { total_pages: number };
  }>(
    `verses/${type}/${id}`,
    {
      language: wordLang,
      words: 'true',
      word_translation_language: wordLang,
      word_fields: wordFields,
      fields: 'text_uthmani,text_indopak,audio',
      ...(translationParam
        ? { translations: translationParam, translation_fields: 'resource_name' }
        : {}),
      per_page: perPage.toString(),
      page: page.toString(),
    },
    'Failed to fetch verses'
  );
  const totalPages = data.meta?.total_pages ?? data.pagination?.total_pages ?? 1;
  return {
    totalPages,
    verses: data.verses.map((v) => normalizeVerse(v, wordLang)),
  };
}

type VerseLookupOptions = Omit<FetchVersesOptions, 'type'>;

export function getVersesByChapter(options: VerseLookupOptions): Promise<PaginatedVerses> {
  return fetchVerses({ type: 'by_chapter', ...options });
}

export function getVersesByJuz(options: VerseLookupOptions): Promise<PaginatedVerses> {
  return fetchVerses({ type: 'by_juz', ...options });
}

export function getVersesByPage(options: VerseLookupOptions): Promise<PaginatedVerses> {
  return fetchVerses({ type: 'by_page', ...options });
}
