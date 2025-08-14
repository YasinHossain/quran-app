import { Verse, Juz, Word } from '@/types';
import type { LanguageCode } from '@/lib/text/languageCodes';
import { apiFetch } from './client';

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

export async function getRandomVerse(translationId: number): Promise<Verse> {
  const data = await apiFetch<{ verse: ApiVerse }>(
    'verses/random',
    { translations: translationId.toString(), fields: 'text_uthmani' },
    'Failed to fetch random verse'
  );
  return normalizeVerse(data.verse);
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
