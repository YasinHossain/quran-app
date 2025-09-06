import * as apiVerses from '../../../../lib/api/verses';
import { Verse } from '../../../domain/entities';
import { logger } from '../../monitoring/Logger';
import { mapApiVerseToDomain } from '../verseMapper';

export { findSajdahVerses, findFirstVerses } from './sajdahQueries';
export { findNext, findPrevious } from './navigationQueries';

export const findByVerseKeys = async (verseKeys: string[], translationId: number): Promise<Verse[]> => {
  const verses: Verse[] = [];
  for (const key of verseKeys) {
    try {
      const apiVerse = await apiVerses.getVerseByKey(key, translationId);
      verses.push(mapApiVerseToDomain(apiVerse));
    } catch (error) {
      logger.error(`Failed to fetch verse ${key}:`, undefined, error as Error);
    }
  }
  return verses;
};
export const findRandom = async (_count = 1, _surahId: number | undefined, translationId: number): Promise<Verse[]> => {
  try {
    const randomVerse = await apiVerses.getRandomVerse(translationId);
    return [mapApiVerseToDomain(randomVerse)];
  } catch (error) {
    logger.error('Failed to find random verse:', undefined, error as Error);
    return [];
  }
};
export const getTotalCount = async (): Promise<number> => 6236;
export const findWithTranslation = async (verseId: string, translationId: number): Promise<Verse | null> => {
  try {
    const apiVerse = await apiVerses.getVerseById(verseId, translationId);
    return mapApiVerseToDomain(apiVerse);
  } catch (error) {
    logger.error('Failed to find verse with translation:', undefined, error as Error);
    return null;
  }
};
export const findByRevelationType = async (_type: 'makki' | 'madani'): Promise<Verse[]> => {
  logger.warn('findByRevelationType not fully implemented - requires surah metadata');
  return [];
};
export const cacheForOffline = async (_surahIds?: number[]): Promise<void> =>
  logger.warn('Offline caching not implemented');
export const clearCache = async (): Promise<void> =>
  logger.warn('Cache clearing not implemented');

