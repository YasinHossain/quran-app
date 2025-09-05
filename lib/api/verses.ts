import { logger } from '@/src/infrastructure/monitoring/Logger';
import { Verse, Juz, Word, Surah } from '@/types';

import { getSurahList } from './chapters';
import { apiFetch } from './client';

import type { LanguageCode } from '@/lib/text/languageCodes';

let surahList: Surah[] | null = null;

export function clearSurahListCache() {
  surahList = null;
}

interface ApiWord {
  id: number;
  text: string;
  text_uthmani?: string;
  translation?: { text?: string };
  [key: string]: unknown;
}

interface ApiVerse extends Omit<Verse, 'words'> {
  words?: ApiWord[];
}

/**
 * Normalize API verse data into the internal `Verse` shape.
 *
 * @param raw       Verse object as returned by the API.
 * @param wordLang  Key used for word-by-word translations.
 *
 * Safely maps optional `words` array, falling back to base text when the
 * Uthmani script or translations are missing.
 */
function normalizeVerse(raw: ApiVerse, wordLang: string = 'en'): Verse {
  return {
    ...raw,
    words: raw.words?.map(
      (w): Word => ({
        id: w.id,
        uthmani: w.text_uthmani ?? w.text,
        [wordLang]: w.translation?.text,
      })
    ),
  };
}

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

export async function searchVerses(query: string): Promise<Verse[]> {
  const data = await apiFetch<{ search?: { results: SearchApiResult[] } }>(
    'search',
    { q: query, size: '20', translations: '20' },
    'Failed to search verses'
  );
  const results: SearchApiResult[] = data.search?.results || [];
  return results.map((r) => ({
    id: r.verse_id,
    verse_key: r.verse_key,
    text_uthmani: r.text,
    translations: r.translations,
  })) as Verse[];
}

interface SearchApiResult {
  verse_key: string;
  verse_id: number;
  text: string;
  translations?: Verse['translations'];
}

export async function getJuz(juzId: string | number): Promise<Juz> {
  const data = await apiFetch<{ juz: Juz }>(`juzs/${juzId}`, {}, 'Failed to fetch juz');
  return data.juz as Juz;
}

export async function getRandomVerse(
  translationId: number,
  rng: () => number = Math.random
): Promise<Verse> {
  try {
    // Get surah list to know verse counts
    const surahs = surahList ?? (surahList = await getSurahList());

    // Pick a random surah
    const randomSurah = surahs[Math.floor(rng() * surahs.length)];

    // Pick a random ayah within that surah
    const randomAyah = Math.floor(rng() * randomSurah.verses) + 1;
    const verseKey = `${randomSurah.number}:${randomAyah}`;

    const data = await apiFetch<{ verse: ApiVerse }>(
      `verses/by_key/${verseKey}`,
      { translations: translationId.toString(), fields: 'text_uthmani' },
      'Failed to fetch random verse'
    );
    return normalizeVerse(data.verse);
  } catch (error) {
    logger.warn('API unavailable, using fallback verse:', undefined, error as Error);
    // Import fallback verse when API fails
    const { fallbackVerse } = await import('./fallback-verse');
    return fallbackVerse;
  }
}

export async function getVerseById(
  verseId: string | number,
  translationId: number
): Promise<Verse> {
  const data = await apiFetch<{ verse: ApiVerse }>(
    `verses/${verseId}`,
    { translations: translationId.toString(), fields: 'text_uthmani' },
    'Failed to fetch verse'
  );
  return normalizeVerse(data.verse);
}

/**
 * Fetch a single verse by its composite key (e.g., "2:255").
 */
export async function getVerseByKey(verseKey: string, translationId: number): Promise<Verse> {
  const data = await apiFetch<{ verse: ApiVerse }>(
    `verses/by_key/${encodeURIComponent(verseKey)}`,
    { translations: translationId.toString(), fields: 'text_uthmani' },
    'Failed to fetch verse by key'
  );
  return normalizeVerse(data.verse);
}
