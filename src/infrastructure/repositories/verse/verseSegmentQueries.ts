import * as apiVerses from '../../../../lib/api/verses';
import { Verse } from '../../../domain/entities';
import { logger } from '../../monitoring/Logger';
import { mapApiVerseToDomain } from '../verseMapper';

export const findByJuz = async (juzNumber: number, translationId: number): Promise<Verse[]> => {
  try {
    const response = await apiVerses.getVersesByJuz({
      id: juzNumber,
      translationIds: translationId,
      page: 1,
      perPage: 500,
    });
    return response.verses.map((v) => mapApiVerseToDomain(v));
  } catch (error) {
    logger.error('Failed to find verses by juz:', undefined, error as Error);
    return [];
  }
};

export const findByPage = async (pageNumber: number, translationId: number): Promise<Verse[]> => {
  try {
    const response = await apiVerses.getVersesByPage({
      id: pageNumber,
      translationIds: translationId,
      page: 1,
      perPage: 50,
    });
    return response.verses.map((v) => mapApiVerseToDomain(v));
  } catch (error) {
    logger.error('Failed to find verses by page:', undefined, error as Error);
    return [];
  }
};

export const findByHizb = async (hizbNumber: number, translationId: number): Promise<Verse[]> => {
  const juzNumber = Math.ceil(hizbNumber / 2);
  const isSecondHalf = hizbNumber % 2 === 0;

  const juzVerses = await findByJuz(juzNumber, translationId);
  const mid = Math.floor(juzVerses.length / 2);

  return isSecondHalf ? juzVerses.slice(mid) : juzVerses.slice(0, mid);
};

export const findByRubAlHizb = async (
  rubNumber: number,
  translationId: number
): Promise<Verse[]> => {
  const hizbNumber = Math.ceil(rubNumber / 4);
  const rubInHizb = ((rubNumber - 1) % 4) + 1;

  const hizbVerses = await findByHizb(hizbNumber, translationId);
  const segmentSize = Math.floor(hizbVerses.length / 4);
  const startIndex = (rubInHizb - 1) * segmentSize;
  const endIndex = rubInHizb === 4 ? hizbVerses.length : startIndex + segmentSize;

  return hizbVerses.slice(startIndex, endIndex);
};
