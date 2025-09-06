import * as apiVerses from '../../../../lib/api/verses';
import { Verse } from '../../../domain/entities';
import { logger } from '../../monitoring/Logger';
import { mapApiVerseToDomain } from '../verseMapper';

export const findBySurah = async (surahId: number, translationId: number): Promise<Verse[]> => {
  try {
    const response = await apiVerses.getVersesByChapter(surahId, translationId, 1, 300);
    return response.verses.map((v) => mapApiVerseToDomain(v));
  } catch (error) {
    logger.error('Failed to find verses by surah:', undefined, error as Error);
    return [];
  }
};

export const findBySurahRange = async (
  surahId: number,
  fromAyah: number,
  toAyah: number,
  translationId: number
): Promise<Verse[]> => {
  try {
    const allVerses = await findBySurah(surahId, translationId);
    return allVerses.filter((v) => v.ayahNumber >= fromAyah && v.ayahNumber <= toAyah);
  } catch (error) {
    logger.error('Failed to find verses by surah range:', undefined, error as Error);
    return [];
  }
};

export const getCountBySurah = async (surahId: number, translationId: number): Promise<number> => {
  try {
    const verses = await findBySurah(surahId, translationId);
    return verses.length;
  } catch (error) {
    logger.error('Failed to get count by surah:', undefined, error as Error);
    return 0;
  }
};
