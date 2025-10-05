import * as apiVerses from '@/lib/api/verses';
import { Verse } from '@/src/domain/entities/Verse';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import { findBySurah } from './verseBulkQueries';
import { mapApiVerseToDomain } from './verseMapper';

export const findNext = async (
  currentVerseId: string,
  translationId: number
): Promise<Verse | null> => {
  try {
    const current = await apiVerses.getVerseById(currentVerseId, translationId);
    const parts = current.verse_key.split(':');
    const surahId = parseInt(parts[0] ?? '0', 10);
    const ayahNumber = parseInt(parts[1] ?? '0', 10);

    try {
      const next = await apiVerses.getVerseByKey(`${surahId}:${ayahNumber + 1}`, translationId);
      return mapApiVerseToDomain(next);
    } catch {
      if (surahId < 114) {
        const first = await apiVerses.getVerseByKey(`${surahId + 1}:1`, translationId);
        return mapApiVerseToDomain(first);
      }
      return null;
    }
  } catch (error) {
    logger.error('Failed to find next verse:', undefined, error as Error);
    return null;
  }
};

export const findPrevious = async (
  currentVerseId: string,
  translationId: number
): Promise<Verse | null> => {
  try {
    const current = await apiVerses.getVerseById(currentVerseId, translationId);
    const parts = current.verse_key.split(':');
    const surahId = parseInt(parts[0] ?? '0', 10);
    const ayahNumber = parseInt(parts[1] ?? '0', 10);

    if (ayahNumber > 1) {
      const prev = await apiVerses.getVerseByKey(`${surahId}:${ayahNumber - 1}`, translationId);
      return mapApiVerseToDomain(prev);
    }

    if (surahId > 1) {
      const prevSurah = await findBySurah(surahId - 1, translationId);
      return prevSurah[prevSurah.length - 1] || null;
    }

    return null;
  } catch (error) {
    logger.error('Failed to find previous verse:', undefined, error as Error);
    return null;
  }
};
