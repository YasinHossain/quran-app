import * as apiVerses from '@/lib/api/verses';
import * as apiSearch from '@/lib/api/verses';
import { Verse } from '@/src/domain/entities';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import { mapApiVerseToDomain } from './verseMapper';

export const findById = async (id: string, translationId: number): Promise<Verse | null> => {
  try {
    const apiVerse = await apiVerses.getVerseById(id, translationId);
    return mapApiVerseToDomain(apiVerse);
  } catch (error) {
    logger.error('Failed to find verse by ID:', undefined, error as Error);
    return null;
  }
};

export const findBySurahAndAyah = async (
  surahId: number,
  ayahNumber: number,
  translationId: number
): Promise<Verse | null> => {
  try {
    const verseKey = `${surahId}:${ayahNumber}`;
    const apiVerse = await apiVerses.getVerseByKey(verseKey, translationId);
    return mapApiVerseToDomain(apiVerse);
  } catch (error) {
    logger.error('Failed to find verse by surah and ayah:', undefined, error as Error);
    return null;
  }
};

export const search = async (
  query: string,
  options:
    | {
        searchIn?: 'arabic' | 'translation' | 'both';
        translationId?: number;
        surahId?: number;
        limit?: number;
      }
    | undefined,
  translationId: number
): Promise<Verse[]> => {
  try {
    const apiResults = await apiSearch.searchVerses(query);
    let results = apiResults.map((v) => mapApiVerseToDomain(v));
    // Apply minimal client-side filtering to reduce noise and use parameters
    if (options?.surahId) {
      results = results.filter((v) => v.surahId === options.surahId);
    }
    if (options?.limit && options.limit > 0) {
      results = results.slice(0, options.limit);
    }
    if (options?.translationId && options.translationId !== translationId) {
      logger.warn('Search translationId ignored by API; results may not match requested id', {
        requested: options.translationId,
        used: translationId,
      });
    }
    return results;
  } catch (error) {
    logger.error('Failed to search verses:', undefined, error as Error);
    return [];
  }
};

export const findWithTranslation = async (
  verseId: string,
  translationId: number
): Promise<Verse | null> => {
  try {
    const apiVerse = await apiVerses.getVerseById(verseId, translationId);
    return mapApiVerseToDomain(apiVerse);
  } catch (error) {
    logger.error('Failed to find verse with translation:', undefined, error as Error);
    return null;
  }
};
