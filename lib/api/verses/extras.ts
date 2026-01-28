import { getSurahList } from '@/lib/api/chapters';
import { apiFetch } from '@/lib/api/client';
import { logger } from '@/src/infrastructure/monitoring/Logger';
import { Verse, Juz, Surah } from '@/types';

import { normalizeVerse, ApiVerse } from './normalize';

import type { LanguageCode } from '@/lib/text/languageCodes';

let surahList: Surah[] | null = null;
let surahListPromise: Promise<Surah[]> | null = null;

export function clearSurahListCache(): void {
  surahList = null;
  surahListPromise = null;
}

async function getSurahListCached(): Promise<Surah[]> {
  if (surahList) return surahList;

  if (!surahListPromise) {
    surahListPromise = getSurahList()
      .then((surahs) => {
        surahList = surahs;
        surahListPromise = null;
        return surahs;
      })
      .catch((error) => {
        surahListPromise = null;
        throw error;
      });
  }

  return surahListPromise;
}

interface SearchApiResult {
  verse_key: string;
  verse_id: number;
  text: string;
  translations?: Verse['translations'];
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

export async function getJuz(juzId: string | number): Promise<Juz> {
  const data = await apiFetch<{ juz: Juz }>(`juzs/${juzId}`, {}, 'Failed to fetch juz');
  return data.juz as Juz;
}

export async function getRandomVerse(
  translationId: number,
  rng: () => number = Math.random
): Promise<Verse> {
  try {
    const surahs = await getSurahListCached();
    if (!surahs.length) {
      throw new Error('No surahs available');
    }
    const idx = Math.min(Math.floor(rng() * surahs.length), surahs.length - 1);
    const randomSurah = surahs[idx]!;
    const randomAyah = Math.min(Math.floor(rng() * randomSurah.verses) + 1, randomSurah.verses);
    const verseKey = `${randomSurah.number}:${randomAyah}`;
    const data = await apiFetch<{ verse: ApiVerse }>(
      `verses/by_key/${verseKey}`,
      {
        translations: translationId.toString(),
        fields: 'text_uthmani',
        translation_fields: 'resource_name',
      },
      'Failed to fetch random verse'
    );
    return normalizeVerse(data.verse);
  } catch (error) {
    logger.warn('API unavailable, using fallback verse:', undefined, error as Error);
    const { fallbackVerse } = await import('../fallback-verse');
    return fallbackVerse;
  }
}

/**
 * Fetch multiple random verses for the Verse of the Day rotation.
 * Pre-fetches at build time for instant LCP.
 *
 * @param count Number of verses to fetch (default: 5)
 * @param translationId Translation ID to use
 * @returns Array of random verses
 */
export async function getRandomVerses(
  count: number = 5,
  translationId: number = 131
): Promise<Verse[]> {
  try {
    // Use a seeded approach based on current hour to get consistent verses per hour
    const now = new Date();
    const hourSeed =
      now.getFullYear() * 1000000 +
      (now.getMonth() + 1) * 10000 +
      now.getDate() * 100 +
      now.getHours();

    // Simple seeded random generator for reproducible results
    const seededRng = (seed: number) => {
      let s = seed;
      return () => {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        return s / 0x7fffffff;
      };
    };

    const rng = seededRng(hourSeed);

    // Fetch verses in parallel
    const versePromises = Array.from({ length: count }, () => getRandomVerse(translationId, rng));

    const verses = await Promise.all(versePromises);
    return verses;
  } catch (error) {
    logger.warn('Failed to fetch random verses, using fallback:', undefined, error as Error);
    const { fallbackVerse } = await import('../fallback-verse');
    return [fallbackVerse];
  }
}

export async function getVerseById(
  verseId: string | number,
  translationIds: number | number[],
  wordLang: LanguageCode = 'en',
  tajweed = false
): Promise<Verse> {
  const translationsParam = Array.isArray(translationIds)
    ? translationIds.join(',')
    : translationIds.toString();

  // Include code_v2 and page_number when tajweed is enabled for V4 font rendering
  const wordFields = tajweed ? 'text_uthmani,code_v2,page_number' : 'text_uthmani';

  const data = await apiFetch<{ verse: ApiVerse }>(
    `verses/${verseId}`,
    {
      translations: translationsParam,
      fields: 'text_uthmani,audio',
      words: 'true',
      word_translation_language: wordLang,
      word_fields: wordFields,
      translation_fields: 'resource_name',
    },
    'Failed to fetch verse'
  );
  return normalizeVerse(data.verse, wordLang);
}

/**
 * Fetch a single verse by its composite key (e.g., "2:255").
 */
export async function getVerseByKey(
  verseKey: string,
  translationIds: number | number[],
  wordLang: LanguageCode = 'en',
  tajweed = false
): Promise<Verse> {
  const translationsParam = Array.isArray(translationIds)
    ? translationIds.join(',')
    : translationIds.toString();

  // Include code_v2 and page_number when tajweed is enabled for V4 font rendering
  const wordFields = tajweed ? 'text_uthmani,code_v2,page_number' : 'text_uthmani';

  const data = await apiFetch<{ verse: ApiVerse }>(
    `verses/by_key/${encodeURIComponent(verseKey)}`,
    {
      translations: translationsParam,
      fields: 'text_uthmani,audio',
      words: 'true',
      word_translation_language: wordLang,
      word_fields: wordFields,
      translation_fields: 'resource_name',
    },
    'Failed to fetch verse by key'
  );
  return normalizeVerse(data.verse, wordLang);
}
