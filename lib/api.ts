const API_BASE_URL = process.env.QURAN_API_BASE_URL ?? 'https://api.quran.com/api/v4';

import { Chapter, TranslationResource, Verse, Juz, Word } from '@/types';
import type { LanguageCode } from '@/lib/languageCodes';

// Caching tafsir responses for efficiency
const tafsirCache = new Map<string, string>();

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

// Normalize API verse to app shape
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
  const res = await fetch(`${API_BASE_URL}/chapters?language=en`);
  if (!res.ok) {
    throw new Error(`Failed to fetch chapters: ${res.status}`);
  }
  const data = await res.json();
  return data.chapters as Chapter[];
}

// Fetch all translations
export async function getTranslations(): Promise<TranslationResource[]> {
  const res = await fetch(`${API_BASE_URL}/resources/translations`);
  if (!res.ok) {
    throw new Error(`Failed to fetch translations: ${res.status}`);
  }
  const data = await res.json();
  return data.translations as TranslationResource[];
}

// Fetch all word-by-word translation resources
export async function getWordTranslations(): Promise<TranslationResource[]> {
  const res = await fetch(`${API_BASE_URL}/resources/translations?resource_type=word_by_word`);
  if (!res.ok) {
    throw new Error(`Failed to fetch translations: ${res.status}`);
  }
  const data = await res.json();
  return data.translations as TranslationResource[];
}

// Fetch all tafsir resources
export async function getTafsirResources(): Promise<TafsirResource[]> {
  const res = await fetch(`${API_BASE_URL}/resources/tafsirs`);
  if (!res.ok) {
    throw new Error(`Failed to fetch tafsir resources: ${res.status}`);
  }
  const data = await res.json();
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

// Get paginated verses by chapter
export async function getVersesByChapter(
  chapterId: string | number,
  translationId: number,
  page = 1,
  perPage = 20,
  wordLang = 'en'
): Promise<PaginatedVerses> {
  let url = `${API_BASE_URL}/verses/by_chapter/${chapterId}?language=${wordLang}&words=true`;
  url += `&word_translation_language=${wordLang}`;
  url += `&word_fields=text_uthmani&translations=${translationId}&fields=text_uthmani,audio&per_page=${perPage}&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch verses: ${res.status}`);
  }
  const data = await res.json();
  const totalPages = data.meta?.total_pages || data.pagination?.total_pages || 1;
  const verses = (data.verses as ApiVerse[]).map((v) =>
    normalizeVerse(v, wordLang as LanguageCode)
  );
  return { verses, totalPages };
}

// Search verses by query
export async function searchVerses(query: string): Promise<Verse[]> {
  const url = `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&size=20&translations=20`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to search verses: ${res.status}`);
  }
  const data = await res.json();
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
  const url = `${API_BASE_URL}/tafsirs/${tafsirId}/by_ayah/${encodeURIComponent(verseKey)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch tafsir: ${res.status}`);
  }
  const data = await res.json();
  return data.tafsir?.text as string;
}

// Fetch tafsir with cache (for repeated access)
export async function getTafsirCached(verseKey: string, id: string): Promise<string> {
  const key = `${id}:${verseKey}`;
  if (tafsirCache.has(key)) {
    return tafsirCache.get(key)!;
  }
  const res = await fetch(
    `${API_BASE_URL}/tafsirs/${id}?verse_key=${encodeURIComponent(verseKey)}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch tafsir: ${res.status}`);
  }
  const data = await res.json();
  const text = data.tafsir?.text as string;
  tafsirCache.set(key, text);
  return text;
}

// Get verses by Juz (section)
export async function getVersesByJuz(
  juzId: string | number,
  translationId: number,
  page = 1,
  perPage = 20,
  wordLang = 'en'
): Promise<PaginatedVerses> {
  const url = `${API_BASE_URL}/verses/by_juz/${juzId}?language=${wordLang}&words=true&word_translation_language=${wordLang}&word_fields=text_uthmani&translations=${translationId}&fields=text_uthmani,audio&per_page=${perPage}&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch verses: ${res.status}`);
  }
  const data = await res.json();
  const totalPages = data.meta?.total_pages || data.pagination?.total_pages || 1;
  const verses = (data.verses as ApiVerse[]).map((v) =>
    normalizeVerse(v, wordLang as LanguageCode)
  );
  return { verses, totalPages };
}

// Get verses by Mushaf page
export async function getVersesByPage(
  pageId: string | number,
  translationId: number,
  page = 1,
  perPage = 20,
  wordLang = 'en'
): Promise<PaginatedVerses> {
  const url = `${API_BASE_URL}/verses/by_page/${pageId}?language=${wordLang}&words=true&word_translation_language=${wordLang}&word_fields=text_uthmani&translations=${translationId}&fields=text_uthmani,audio&per_page=${perPage}&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch verses: ${res.status}`);
  }
  const data = await res.json();
  const totalPages = data.meta?.total_pages || data.pagination?.total_pages || 1;
  const verses = (data.verses as ApiVerse[]).map((v) =>
    normalizeVerse(v, wordLang as LanguageCode)
  );
  return { verses, totalPages };
}

// Fetch information about a specific Juz
export async function getJuz(juzId: string | number): Promise<Juz> {
  const res = await fetch(`${API_BASE_URL}/juzs/${juzId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch juz: ${res.status}`);
  }
  const data = await res.json();
  return data.juz as Juz;
}

// Fetch a random verse with translation
export async function getRandomVerse(translationId: number): Promise<Verse> {
  const url = `${API_BASE_URL}/verses/random?translations=${translationId}&fields=text_uthmani`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch random verse: ${res.status}`);
  }
  const data = await res.json();
  return normalizeVerse(data.verse);
}

// Export base URL for use elsewhere
export { API_BASE_URL };
