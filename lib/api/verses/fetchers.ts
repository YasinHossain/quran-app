import type { LanguageCode } from '@/lib/text/languageCodes';
import { Verse } from '@/types';

import { apiFetch } from '../client';
import { normalizeVerse, ApiVerse } from './normalize';

export interface PaginatedVerses {
  verses: Verse[];
  totalPages: number;
}

/**
 * Fetch verses grouped by chapter, juz or page and return pagination info.
 *
 * @param type            Grouping method for the verses.
 * @param id              Identifier for the grouping (chapter/juz/page).
 * @param translationIds  One or more translation IDs.
 * @param page            Page number (1-indexed).
 * @param perPage         Number of verses per page.
 * @param wordLang        Language code for word translations.
 *
 * Handles single vs array translation IDs and normalizes API pagination
 * metadata, defaulting to one page when the server omits totals.
 */
export async function fetchVerses(
  type: 'by_chapter' | 'by_juz' | 'by_page',
  id: string | number,
  translationIds: number | number[],
  page = 1,
  perPage = 20,
  wordLang: string = 'en'
): Promise<PaginatedVerses> {
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

export function getVersesByChapter(
  chapterId: string | number,
  translationIds: number | number[],
  page = 1,
  perPage = 20,
  wordLang: string = 'en'
): Promise<PaginatedVerses> {
  return fetchVerses('by_chapter', chapterId, translationIds, page, perPage, wordLang);
}

export function getVersesByJuz(
  juzId: string | number,
  translationIds: number | number[],
  page = 1,
  perPage = 20,
  wordLang: string = 'en'
): Promise<PaginatedVerses> {
  return fetchVerses('by_juz', juzId, translationIds, page, perPage, wordLang);
}

export function getVersesByPage(
  pageId: string | number,
  translationIds: number | number[],
  page = 1,
  perPage = 20,
  wordLang: string = 'en'
): Promise<PaginatedVerses> {
  return fetchVerses('by_page', pageId, translationIds, page, perPage, wordLang);
}
