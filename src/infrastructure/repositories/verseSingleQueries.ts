import * as apiVerses from '../../../lib/api/verses';
import * as apiSearch from '../../../lib/api/verses';
import { Verse } from '../../domain/entities';
import { logger } from '../monitoring/Logger';
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
  _options:
    | {
        searchIn?: 'arabic' | 'translation' | 'both';
        translationId?: number;
        surahId?: number;
        limit?: number;
      }
    | undefined,
  _translationId: number
): Promise<Verse[]> => {
  try {
    const apiResults = await apiSearch.searchVerses(query);
    return apiResults.map((v) => mapApiVerseToDomain(v));
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
