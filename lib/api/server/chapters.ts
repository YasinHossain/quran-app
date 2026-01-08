/**
 * Server-side chapter fetching utilities.
 * These functions are designed to be called from Server Components
 * and include caching for optimal performance.
 */

import { unstable_cache } from 'next/cache';

import type { Chapter } from '@/types';

const API_BASE_URL = process.env['QURAN_API_BASE_URL'] ?? 'https://api.qurancdn.com/api/qdc';

/**
 * Fetch all chapters from the Quran API.
 * This is cached at build time and revalidated periodically.
 */
async function fetchChaptersFromAPI(): Promise<Chapter[]> {
    const url = `${API_BASE_URL}/chapters?language=en`;

    const response = await fetch(url, {
        headers: { Accept: 'application/json' },
        // Cache for 24 hours - chapters never change
        next: { revalidate: 86400 },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch chapters: ${response.status}`);
    }

    const data = await response.json() as { chapters: Chapter[] };
    return data.chapters;
}

/**
 * Get all chapters with Next.js caching.
 * Uses unstable_cache for deduplication and caching across requests.
 */
export const getChaptersServer = unstable_cache(
    fetchChaptersFromAPI,
    ['chapters-list'],
    {
        revalidate: 86400, // 24 hours
        tags: ['chapters'],
    }
);

/**
 * Get a single chapter by ID (server-side).
 */
export async function getChapterServer(id: number): Promise<Chapter | undefined> {
    const chapters = await getChaptersServer();
    return chapters.find((c) => c.id === id);
}
