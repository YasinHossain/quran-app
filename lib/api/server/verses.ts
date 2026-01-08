import { unstable_cache } from 'next/cache';

import { apiFetch } from '@/lib/api/client';
import { normalizeVerse, ApiVerse } from '@/lib/api/verses/normalize';
import { Verse } from '@/types';

import { getChaptersServer } from './chapters';

// Default translation ID (e.g. 131 - Clear Quran)
const DEFAULT_TRANSLATION = 131;

async function fetchRandomVerse(): Promise<Verse> {
    const chapters = await getChaptersServer();
    const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];

    // Ensure we have a valid chapter
    if (!randomChapter) {
        throw new Error('No chapters available');
    }

    const randomAyah = Math.floor(Math.random() * randomChapter.verses_count) + 1;
    const verseKey = `${randomChapter.id}:${randomAyah}`;

    const data = await apiFetch<{ verse: ApiVerse }>(
        `verses/by_key/${verseKey}`,
        {
            translations: DEFAULT_TRANSLATION.toString(),
            fields: 'text_uthmani',
            translation_fields: 'resource_name',
        },
        'Failed to fetch random verse'
    );

    return normalizeVerse(data.verse);
}

/**
 * Get a random verse for the day (server-side).
 * Cached for 24 hours to serve as a consistent "Verse of the Day".
 */
export const getVerseOfDayServer = unstable_cache(
    fetchRandomVerse,
    ['verse-of-day-server'],
    {
        revalidate: 86400, // Cache for 24 hours
        tags: ['verse-of-day']
    }
);
