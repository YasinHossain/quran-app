const API_BASE_URL = process.env.QURAN_API_BASE_URL ?? 'https://api.quran.com/api/v4';

import { Chapter, TranslationResource, Verse, Juz, Word } from '@/types';
import type { LanguageCode } from '@/lib/text/languageCodes';

// Internal helper to fetch from the API with query parameters
async function apiFetch<T>(
  path: string,
  params: Record<string, string> = {},
  errorPrefix = 'Failed to fetch'
): Promise<T> {
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  const url = new URL(path.replace(/^\//, ''), base);
  if (Object.keys(params).length) {
    const search = new URLSearchParams(params).toString().replace(/%2C/g, ',');
    url.search = search;
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`${errorPrefix}: ${res.status}`);
  }
  return (await res.json()) as T;
}

// API response word shape
interface ApiWord {
  id: number;
  text: string;
  text_uthmani?: string;
  translation?: { text?: string };
  [key: string]: unknown;
}

// API response verse shape, with optional words array
interface ApiVerse extends Omit<Verse, 'words'> {
  words?: ApiWord[];
}

/**
 * Converts API verse and word objects into the internal {@link Verse} format.
 *
 * @param raw - Verse object returned from the API. May include word entries.
 * @param wordLang - Language to use for each word's translation. Defaults to English.
 * @returns The normalized verse with translated words.
 */
function normalizeVerse(raw: ApiVerse, wordLang: LanguageCode = 'en'): Verse {
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

// Fetch all chapters
export async function getChapters(): Promise<Chapter[]> {
  const data = await apiFetch<{ chapters: Chapter[] }>(
    'chapters',
    { language: 'en' },
    'Failed to fetch chapters'
  );
  return data.chapters as Chapter[];
}

// Fetch all translations
export async function getTranslations(): Promise<TranslationResource[]> {
  const data = await apiFetch<{ translations: TranslationResource[] }>(
    'resources/translations',
    {},
    'Failed to fetch translations'
  );
  return data.translations as TranslationResource[];
}

// Fetch all word-by-word translation resources
export async function getWordTranslations(): Promise<TranslationResource[]> {
  const data = await apiFetch<{ translations: TranslationResource[] }>(
    'resources/translations',
    { resource_type: 'word_by_word' },
    'Failed to fetch translations'
  );
  return data.translations as TranslationResource[];
}

// Fetch all tafsir resources
export async function getTafsirResources(): Promise<TafsirResource[]> {
  const data = await apiFetch<{ tafsirs: TafsirResource[] }>(
    'resources/tafsirs',
    {},
    'Failed to fetch tafsir resources'
  );
  return data.tafsirs as TafsirResource[];
}

// Types for paginated results and tafsir
export interface PaginatedVerses {
  verses: Verse[];
  totalPages: number;
}

export interface TafsirResource {
  id: number;
  slug: string;
  name: string;
  language_name: string;
}

interface SearchApiResult {
  verse_key: string;
  verse_id: number;
  text: string;
  translations?: Verse['translations'];
}

/**
 * Fetches paginated verses from the API and normalizes any word data.
 *
 * @param {'by_chapter'|'by_juz'|'by_page'} type - Endpoint to query: chapter, juz, or page.
 * @param {string|number} id - Identifier for the chosen endpoint.
 * @param {number} translationId - Translation resource to include for each verse.
 * @param {number} [page=1] - Page of results to retrieve.
 * @param {number} [perPage=20] - Number of verses to return per page.
 * @param {LanguageCode|string} [wordLang='en'] - Language code for word translations.
 * @returns {Promise<{ verses: Verse[]; totalPages: number }>} Object containing the
 * normalized verses array and total available pages.
 */
export async function fetchVerses(
  type: 'by_chapter' | 'by_juz' | 'by_page',
  id: string | number,
  translationId: number,
  page = 1,
  perPage = 20,
  wordLang: LanguageCode | string = 'en'
): Promise<PaginatedVerses> {
  const data = await apiFetch<{
    verses: ApiVerse[];
    meta?: { total_pages?: number };
    pagination?: { total_pages?: number };
  }>(
    `verses/${type}/${id}`,
    {
      language: String(wordLang),
      words: 'true',
      word_translation_language: String(wordLang),
      word_fields: 'text_uthmani',
      translations: translationId.toString(),
      fields: 'text_uthmani,audio',
      per_page: perPage.toString(),
      page: page.toString(),
    },
    'Failed to fetch verses'
  );
  const totalPages = data.meta?.total_pages || data.pagination?.total_pages || 1;
  const verses = (data.verses as ApiVerse[]).map((v) =>
    normalizeVerse(v, wordLang as LanguageCode)
  );
  return { verses, totalPages };
}

// Get paginated verses by chapter
export function getVersesByChapter(
  chapterId: string | number,
  translationId: number,
  page = 1,
  perPage = 20,
  wordLang = 'en'
): Promise<PaginatedVerses> {
  return fetchVerses('by_chapter', chapterId, translationId, page, perPage, wordLang);
}

// Search verses by query
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

// Fetch tafsir text for a specific verse (quick, without cache)
export async function getTafsirByVerse(verseKey: string, tafsirId = 169): Promise<string> {
  const data = await apiFetch<{ tafsir?: { text: string } }>(
    `tafsirs/${tafsirId}/by_ayah/${encodeURIComponent(verseKey)}`,
    {},
    'Failed to fetch tafsir'
  );
  return data.tafsir?.text as string;
}

// Get verses by Juz (section)
export function getVersesByJuz(
  juzId: string | number,
  translationId: number,
  page = 1,
  perPage = 20,
  wordLang = 'en'
): Promise<PaginatedVerses> {
  return fetchVerses('by_juz', juzId, translationId, page, perPage, wordLang);
}

// Get verses by Mushaf page
export function getVersesByPage(
  pageId: string | number,
  translationId: number,
  page = 1,
  perPage = 20,
  wordLang = 'en'
): Promise<PaginatedVerses> {
  return fetchVerses('by_page', pageId, translationId, page, perPage, wordLang);
}

/**
 * Fetches metadata for a given Juz (one of thirty sections of the Qur'an).
 *
 * @param {string|number} juzId - Numeric identifier of the Juz to retrieve.
 * @returns {Promise<Juz>} Promise resolving to the Juz data including its
 * verse mapping and verse boundaries.
 */
export async function getJuz(juzId: string | number): Promise<Juz> {
  const data = await apiFetch<{ juz: Juz }>(`juzs/${juzId}`, {}, 'Failed to fetch juz');
  return data.juz as Juz;
}

/**
 * Retrieves a random verse along with a specified translation.
 *
 * @param {number} translationId - Translation resource identifier to include.
 * @returns {Promise<Verse>} Promise resolving to a normalized verse object
 * containing the requested translation.
 */
export async function getRandomVerse(translationId: number): Promise<Verse> {
  const data = await apiFetch<{ verse: ApiVerse }>(
    'verses/random',
    { translations: translationId.toString(), fields: 'text_uthmani' },
    'Failed to fetch random verse'
  );
  return normalizeVerse(data.verse);
}

/**
 * Fetches a single verse by its identifier and normalizes the result.
 *
 * @param {string|number} verseId - Identifier of the verse to retrieve.
 * @param {number} translationId - Translation resource to include.
 * @returns {Promise<Verse>} Promise resolving to the normalized verse.
 */
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

import { surahImageMap } from '@/app/(features)/surah/lib/surahImageMap';

export async function getSurahCoverUrl(surahNumber: number): Promise<string | null> {
  const filename = surahImageMap[surahNumber];
  if (!filename) return null;

  try {
    const response = await fetch(`https://api.wikimedia.org/core/v1/commons/file/File:${filename}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.preferred.url || null;
  } catch (error) {
    console.error('Error fetching surah cover:', error);
    return null;
  }
}

// Export base URL for use elsewhere
export { API_BASE_URL };
