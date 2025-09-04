import { Chapter, Surah } from '@/types';
import { apiFetch } from './client';
import { surahImageMap } from '@/app/(features)/surah/lib/surahImageMap';
import { logger } from '@/src/infrastructure/monitoring/Logger';

export async function getChapters(): Promise<Chapter[]> {
  const data = await apiFetch<{ chapters: Chapter[] }>(
    'chapters',
    { language: 'en' },
    'Failed to fetch chapters'
  );
  return data.chapters as Chapter[];
}

export async function getSurahList(): Promise<Surah[]> {
  const chapters = await getChapters();
  return chapters.map((c) => ({
    number: c.id,
    name: c.name_simple,
    arabicName: c.name_arabic,
    verses: c.verses_count,
    meaning: c.translated_name?.name ?? '',
  }));
}

/**
 * Fetch the Wikimedia cover image URL for a given surah.
 *
 * @param surahNumber 1-based surah index.
 *
 * Returns `null` when the surah has no mapped image, the request fails, or
 * Wikimedia responds without a usable URL.
 */
export async function getSurahCoverUrl(surahNumber: number): Promise<string | null> {
  const filename = surahImageMap[surahNumber];
  if (!filename) return null;

  try {
    const response = await fetch(`https://api.wikimedia.org/core/v1/commons/file/File:${filename}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.preferred.url || null;
  } catch (error) {
    logger.error('Error fetching surah cover:', undefined, error as Error);
    return null;
  }
}
