import { Verse } from '@/types';

import { apiFetch } from '../client';
import { normalizeVerse, ApiVerse } from './normalize';

import type { LanguageCode } from '@/lib/text/languageCodes';

export interface PaginatedVerses {
  verses: Verse[];
  totalPages: number;
}

export interface FetchVersesOptions {
  type: 'by_chapter' | 'by_juz' | 'by_page';
  id: string | number;
  translationIds: number | number[];
  page?: number;
  perPage?: number;
  wordLang?: string;
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
}: FetchVersesOptions): Promise<PaginatedVerses> {
  const lang = wordLang as LanguageCode;
  const translationIdsArray = Array.isArray(translationIds) ? translationIds : [translationIds];
  const translationParam = translationIdsArray.join(',');

  const data = await apiFetch<{
    verses: ApiVerse[];
    meta?: { total_pages: number };
    pagination?: { total_pages: number };
  }>(
    `verses/${type}/${id}`,
    {
      language: lang,
      words: 'true',
      word_translation_language: lang,
      word_fields: 'text_uthmani',
      translations: translationParam,
      fields: 'text_uthmani,audio',
      per_page: perPage.toString(),
      page: page.toString(),
    },
    'Failed to fetch verses'
  );
  const totalPages = data.meta?.total_pages ?? data.pagination?.total_pages ?? 1;
  return {
    totalPages,
    verses: data.verses.map((v) => normalizeVerse(v, lang)),
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
