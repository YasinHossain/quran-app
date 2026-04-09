import { logger } from '@/src/infrastructure/monitoring/Logger';

import { getChaptersServer } from './chapters';

import type { Chapter, Surah } from '@/types';

function normaliseError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(typeof error === 'string' ? error : 'Unknown error');
}

const mapChapterToSurah = (chapter: Chapter): Surah => ({
  number: chapter.id,
  name: chapter.name_simple,
  arabicName: chapter.name_arabic,
  verses: chapter.verses_count,
  meaning: chapter.translated_name?.name ?? '',
});

export async function getSurahNavigationListServer(): Promise<Surah[]> {
  try {
    const chapters = await getChaptersServer();
    return chapters.map(mapChapterToSurah);
  } catch (error) {
    logger.warn('Failed to load surah navigation list', undefined, normaliseError(error));
    return [];
  }
}
