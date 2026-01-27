import { getSurahList } from '@/lib/api/chapters';
import { apiFetch } from '@/lib/api/client';
import { logger } from '@/src/infrastructure/monitoring/Logger';
import { Verse, Juz, Surah } from '@/types';

import { normalizeVerse, ApiVerse } from './normalize';

import type { LanguageCode } from '@/lib/text/languageCodes';

let surahList: Surah[] | null = null;

export function clearSurahListCache(): void {
  surahList = null;
}

interface SearchApiResult {
  verse_key: string;
  verse_id: number;
  text: string;
  translations?: Verse['translations'];
}

function normalizeTranslationIdsParam(
  translationIds: number | number[] | null | undefined
): string | undefined {
  const ids = Array.isArray(translationIds)
    ? translationIds
    : typeof translationIds === 'number'
      ? [translationIds]
      : [];
  const filtered = ids.filter((id) => Number.isFinite(id));
  return filtered.length ? filtered.join(',') : undefined;
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
    const surahs = surahList ?? (surahList = await getSurahList());
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
  translationIds: number | number[] | null | undefined,
  wordLang: LanguageCode = 'en',
  tajweed = false
): Promise<Verse> {
  const translationsParam = normalizeTranslationIdsParam(translationIds);

  // Include code_v2 and page_number when tajweed is enabled for V4 font rendering
  const wordFields = tajweed ? 'text_uthmani,code_v2,page_number' : 'text_uthmani';

  const data = await apiFetch<{ verse: ApiVerse }>(
    `verses/${verseId}`,
    {
      fields: 'text_uthmani,audio',
      words: 'true',
      word_translation_language: wordLang,
      word_fields: wordFields,
      ...(translationsParam
        ? { translations: translationsParam, translation_fields: 'resource_name' }
        : {}),
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
  translationIds: number | number[] | null | undefined,
  wordLang: LanguageCode = 'en',
  tajweed = false
): Promise<Verse> {
  const translationsParam = normalizeTranslationIdsParam(translationIds);

  // Include code_v2 and page_number when tajweed is enabled for V4 font rendering
  const wordFields = tajweed ? 'text_uthmani,code_v2,page_number' : 'text_uthmani';

  const data = await apiFetch<{ verse: ApiVerse }>(
    `verses/by_key/${encodeURIComponent(verseKey)}`,
    {
      fields: 'text_uthmani,audio',
      words: 'true',
      word_translation_language: wordLang,
      word_fields: wordFields,
      ...(translationsParam
        ? { translations: translationsParam, translation_fields: 'resource_name' }
        : {}),
    },
    'Failed to fetch verse by key'
  );
  return normalizeVerse(data.verse, wordLang);
}

/**
 * Fetch the translation text for a verse key without fetching words/audio.
 * Intended for lightweight UI use-cases (e.g. Verse of the Day).
 */
export async function getVerseTranslationByKey(
  verseKey: string,
  translationId: number
): Promise<string | undefined> {
  if (!verseKey.trim()) return undefined;
  if (!Number.isFinite(translationId)) return undefined;

  const data = await apiFetch<{
    verse: { translations?: Array<{ resource_id: number; text: string }> };
  }>(
    `verses/by_key/${encodeURIComponent(verseKey)}`,
    {
      translations: String(translationId),
      fields: 'text_uthmani',
    },
    'Failed to fetch verse translation'
  );

  return data.verse.translations?.find((t) => t.resource_id === translationId)?.text;
}
