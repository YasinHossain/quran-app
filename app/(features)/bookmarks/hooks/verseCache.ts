'use client';

import { getVerseById, getVerseByKey } from '@/lib/api';

import type { Verse, Chapter } from '@/types';

// Simple cache for verses so we don't over-fetch when rendering bookmark lists.
const verseCache = new Map<string, Verse>();

export const VERSE_CACHE_LIMIT = 100;

/**
 * Clear all cached verses. Useful for tests and stale data scenarios.
 */
export function clearCache(): void {
  verseCache.clear();
}

// Expose cache for testing purposes.
export const __verseCache = verseCache;

const inferVerseKeyFromId = (rawId: string, chapters: Chapter[]): string | null => {
  const numericId = Number.parseInt(rawId, 10);
  if (!Number.isFinite(numericId) || numericId <= 0) return null;

  let remaining = numericId;
  const orderedChapters = [...chapters].sort((a, b) => a.id - b.id);

  for (const chapter of orderedChapters) {
    if (remaining <= chapter.verses_count) {
      return `${chapter.id}:${remaining}`;
    }
    remaining -= chapter.verses_count;
  }

  return null;
};

/**
 * Fetch a verse and cache it locally, inferring composite keys when needed.
 */
export async function getVerseWithCache(
  verseId: string,
  translationId: number,
  chapters: Chapter[]
): Promise<Verse> {
  const cacheKey = `${verseId}-${translationId}`;

  if (verseCache.has(cacheKey)) {
    const verse = verseCache.get(cacheKey)!;
    // Refresh key to maintain LRU order.
    verseCache.delete(cacheKey);
    verseCache.set(cacheKey, verse);
    return verse;
  }

  const isCompositeKey = /:/.test(verseId);
  let verse: Verse;

  if (isCompositeKey) {
    verse = await getVerseByKey(verseId, translationId);
  } else {
    const inferredKey = inferVerseKeyFromId(verseId, chapters);
    if (inferredKey) {
      try {
        verse = await getVerseByKey(inferredKey, translationId);
      } catch {
        verse = await getVerseById(verseId, translationId);
      }
    } else {
      verse = await getVerseById(verseId, translationId);
    }
  }

  // Enforce cache size limit (LRU).
  if (verseCache.size >= VERSE_CACHE_LIMIT) {
    const oldestKey = verseCache.keys().next().value as string;
    verseCache.delete(oldestKey);
  }
  verseCache.set(cacheKey, verse);
  return verse;
}
