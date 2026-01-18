import { unstable_cache } from 'next/cache';

import { Verse } from '@/types';

import { getChaptersServer } from './chapters';

// Default translation ID (20 - Saheeh/Sahih International)
const DEFAULT_TRANSLATION = 20;

// Number of verses to pre-fetch for rotation
const VERSE_COUNT = 5;

// Quran.com API response for verses/by_key
interface VerseByKeyResponse {
  verse: {
    id: number;
    verse_key: string;
    text_uthmani: string;
    translations?: Array<{
      id?: number;
      resource_id: number;
      text: string;
      resource_name?: string;
    }>;
  };
}

async function fetchRandomVerse(seed: number): Promise<Verse> {
  const chapters = await getChaptersServer();

  // Simple seeded random for reproducible results
  let s = seed;
  const rng = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };

  const randomChapter = chapters[Math.floor(rng() * chapters.length)];

  if (!randomChapter) {
    throw new Error('No chapters available');
  }

  const randomAyah = Math.floor(rng() * randomChapter.verses_count) + 1;
  const verseKey = `${randomChapter.id}:${randomAyah}`;

  const verseUrl = `https://api.quran.com/api/v4/verses/by_key/${encodeURIComponent(verseKey)}?translations=${DEFAULT_TRANSLATION}&fields=text_uthmani&translation_fields=resource_name`;

  const response = await fetch(verseUrl, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 3600 }, // Cache fetch for 1 hour
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch verse: ${response.status}`);
  }

  const data = (await response.json()) as VerseByKeyResponse;
  const result = data.verse;

  const verse: Verse = {
    id: result.id,
    verse_key: result.verse_key,
    text_uthmani: result.text_uthmani,
    words: [],
  };

  if (result.translations) {
    verse.translations = result.translations.map((t) => ({
      ...(t.id ? { id: t.id } : {}),
      resource_id: t.resource_id,
      text: t.text,
      ...(t.resource_name ? { resource_name: t.resource_name } : {}),
    }));
  }

  return verse;
}

async function fetchRandomVerses(): Promise<Verse[]> {
  // Use hour-based seed for consistent verses per hour
  const now = new Date();
  const baseSeed =
    now.getFullYear() * 1000000 +
    (now.getMonth() + 1) * 10000 +
    now.getDate() * 100 +
    now.getHours();

  // Fetch verses in parallel with different seeds
  const versePromises = Array.from({ length: VERSE_COUNT }, (_, i) =>
    fetchRandomVerse(baseSeed + i)
  );

  try {
    const verses = await Promise.all(versePromises);
    // Validate that at least one verse has a translation
    const hasTranslations = verses.some((v) => v.translations && v.translations.length > 0);

    if (!hasTranslations) {
      console.warn('API returned verses without translations, using fallback');
      const { fallbackVerse } = await import('../fallback-verse');
      return [fallbackVerse];
    }
    return verses;
  } catch (e) {
    console.error('Error fetching random verses:', e);
    // If fetching fails, return fallback verse with translation
    const { fallbackVerse } = await import('../fallback-verse');
    return [fallbackVerse];
  }
}

/**
 * Get a single random verse for the day (server-side).
 * Cached for 24 hours to serve as a consistent "Verse of the Day".
 * @deprecated Use getVersesOfDayServer for multiple verses
 */
export const getVerseOfDayServer = unstable_cache(
  async () => {
    const verses = await fetchRandomVerses();
    return verses[0] ?? null;
  },
  ['verse-of-day-server-v2'],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['verse-of-day'],
  }
);

/**
 * Get multiple random verses for the Verse of the Day rotation (server-side).
 * Cached for 1 hour to rotate verses periodically.
 */
export const getVersesOfDayServer = unstable_cache(fetchRandomVerses, ['verses-of-day-server-v2'], {
  revalidate: 3600, // Cache for 1 hour
  tags: ['verses-of-day'],
});
