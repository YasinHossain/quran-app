/**
 * Server-side chapter fetching utilities.
 * These functions are designed to be called from Server Components
 * and include caching for optimal performance.
 */

import { unstable_cache } from 'next/cache';

import { logger } from '@/src/infrastructure/monitoring/Logger';

import type { Chapter } from '@/types';

const API_BASE_URL = process.env['QURAN_API_BASE_URL'] ?? 'https://api.qurancdn.com/api/qdc';
const FALLBACK_CHAPTERS_URL = 'https://api.quran.com/api/v4/chapters?language=en';
const CHAPTERS_REVALIDATE_SECONDS = 86400;

function normaliseError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(typeof error === 'string' ? error : 'Unknown error');
}

async function fetchChaptersFromUrl(url: string): Promise<Chapter[]> {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    // Cache for 24 hours - chapters never change
    next: { revalidate: CHAPTERS_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch chapters: ${response.status}`);
  }

  const data = (await response.json()) as { chapters: Chapter[] };
  return data.chapters;
}

/**
 * Fetch all chapters from the Quran API.
 * This is cached at build time and revalidated periodically.
 */
async function fetchChaptersFromAPI(): Promise<Chapter[]> {
  const primaryUrl = `${API_BASE_URL}/chapters?language=en`;

  try {
    return await fetchChaptersFromUrl(primaryUrl);
  } catch (primaryError) {
    if (primaryUrl === FALLBACK_CHAPTERS_URL) {
      throw primaryError;
    }

    logger.warn(
      'Primary chapters API failed, retrying with fallback source',
      { primaryUrl, fallbackUrl: FALLBACK_CHAPTERS_URL },
      normaliseError(primaryError)
    );

    try {
      return await fetchChaptersFromUrl(FALLBACK_CHAPTERS_URL);
    } catch (fallbackError) {
      logger.error(
        'Fallback chapters API failed',
        { primaryUrl, fallbackUrl: FALLBACK_CHAPTERS_URL },
        normaliseError(fallbackError)
      );
      throw fallbackError;
    }
  }
}

/**
 * Get all chapters with Next.js caching.
 * Uses unstable_cache for deduplication and caching across requests.
 */
export const getChaptersServer = unstable_cache(fetchChaptersFromAPI, ['chapters-list'], {
  revalidate: CHAPTERS_REVALIDATE_SECONDS, // 24 hours
  tags: ['chapters'],
});

/**
 * Get a single chapter by ID (server-side).
 */
export async function getChapterServer(id: number): Promise<Chapter | undefined> {
  const chapters = await getChaptersServer();
  return chapters.find((c) => c.id === id);
}
