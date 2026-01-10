import { unstable_cache } from 'next/cache';

import { apiFetch } from '@/lib/api/client';
import { normalizeVerse } from '@/lib/api/verses/normalize';
import { Verse } from '@/types';

import { getChaptersServer } from './chapters';

// Default translation ID (e.g. 131 - Clear Quran)
const DEFAULT_TRANSLATION = 131;

// Number of verses to pre-fetch for rotation
const VERSE_COUNT = 5;

// Interface for Search API response items
interface SearchResultItem {
    verse_key: string;
    verse_id: number;
    text: string; // The text_uthmani
    translations?: Array<{
        id?: number;
        resource_id: number;
        text: string;
        resource_name?: string;
    }>;
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

    // Use the Search API as it reliably returns translations unlike the verses/by_key endpoint
    // We use q={verseKey} to find the specific verse
    const searchUrl = `https://api.quran.com/api/v4/search?q=${verseKey}&translations=${DEFAULT_TRANSLATION}&fields=text_uthmani&size=1`;

    const response = await fetch(searchUrl, {
        headers: { Accept: 'application/json' },
        next: { revalidate: 3600 } // Cache fetch for 1 hour
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch verse: ${response.status}`);
    }

    const data = await response.json();
    const result = data.search?.results?.[0] as SearchResultItem;

    if (!result) {
        throw new Error('No verse found');
    }

    const verse: Verse = {
        id: result.verse_id,
        verse_key: result.verse_key,
        text_uthmani: result.text,
        words: []
    };

    if (result.translations) {
        verse.translations = result.translations.map(t => ({
            ...(t.id ? { id: t.id } : {}),
            resource_id: t.resource_id,
            text: t.text,
            ...(t.resource_name ? { resource_name: t.resource_name } : {})
        }));
    }

    return verse;
}

async function fetchRandomVerses(): Promise<Verse[]> {
    // Use hour-based seed for consistent verses per hour
    const now = new Date();
    const baseSeed =
        now.getFullYear() * 1000000 + (now.getMonth() + 1) * 10000 + now.getDate() * 100 + now.getHours();

    // Fetch verses in parallel with different seeds
    const versePromises = Array.from({ length: VERSE_COUNT }, (_, i) => fetchRandomVerse(baseSeed + i));

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
    ['verse-of-day-server'],
    {
        revalidate: 3600, // Cache for 1 hour
        tags: ['verse-of-day'],
    }
);

/**
 * Get multiple random verses for the Verse of the Day rotation (server-side).
 * Cached for 1 hour to rotate verses periodically.
 */
export const getVersesOfDayServer = unstable_cache(fetchRandomVerses, ['verses-of-day-server'], {
    revalidate: 3600, // Cache for 1 hour
    tags: ['verses-of-day'],
});
