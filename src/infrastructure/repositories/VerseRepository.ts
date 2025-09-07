import {
  findBySurah as queryFindBySurah,
  findBySurahRange as queryFindBySurahRange,
  findByJuz as queryFindByJuz,
  findByPage as queryFindByPage,
  findByHizb as queryFindByHizb,
  findByRubAlHizb as queryFindByRubAlHizb,
  findSajdahVerses as queryFindSajdahVerses,
  findFirstVerses as queryFindFirstVerses,
  findByVerseKeys as queryFindByVerseKeys,
  findRandom as queryFindRandom,
  getTotalCount as queryGetTotalCount,
  getCountBySurah as queryGetCountBySurah,
} from './verseBulkQueries';
import { findNext as queryFindNext, findPrevious as queryFindPrevious } from './verseNavigation';
import {
  findById as queryFindById,
  findBySurahAndAyah as queryFindBySurahAndAyah,
  search as querySearch,
  findWithTranslation as queryFindWithTranslation,
} from './verseSingleQueries';
import { getChapters } from '../../../lib/api/chapters';
import { Verse } from '../../domain/entities';
import { IVerseRepository } from '../../domain/repositories/IVerseRepository';
import { logger } from '../monitoring/Logger';

export class VerseRepository implements IVerseRepository {
  private readonly defaultTranslationId = 20; // Default English translation

  findById = (id: string): Promise<Verse | null> => queryFindById(id, this.defaultTranslationId);

  save = async (_verse: Verse): Promise<void> => {
    void _verse; // mark as used
    logger.warn('Save operation not supported by read-only API');
    throw new Error('Save operation not supported by read-only API');
  };

  remove = async (_id: string): Promise<void> => {
    void _id; // mark as used
    logger.warn('Remove operation not supported by read-only API');
    throw new Error('Remove operation not supported by read-only API');
  };

  exists = async (id: string): Promise<boolean> => (await this.findById(id)) !== null;

  findBySurahAndAyah = (surahId: number, ayahNumber: number): Promise<Verse | null> =>
    queryFindBySurahAndAyah(surahId, ayahNumber, this.defaultTranslationId);

  search = (
    query: string,
    options?: {
      searchIn?: 'arabic' | 'translation' | 'both';
      translationId?: number;
      surahId?: number;
      limit?: number;
    }
  ): Promise<Verse[]> => querySearch(query, options, this.defaultTranslationId);

  findBySurah = (surahId: number): Promise<Verse[]> =>
    queryFindBySurah(surahId, this.defaultTranslationId);

  findBySurahRange = (surahId: number, fromAyah: number, toAyah: number): Promise<Verse[]> =>
    queryFindBySurahRange(surahId, fromAyah, toAyah, this.defaultTranslationId);

  findByJuz = (juzNumber: number): Promise<Verse[]> =>
    queryFindByJuz(juzNumber, this.defaultTranslationId);

  findByPage = (pageNumber: number): Promise<Verse[]> =>
    queryFindByPage(pageNumber, this.defaultTranslationId);

  findByHizb = (hizbNumber: number): Promise<Verse[]> =>
    queryFindByHizb(hizbNumber, this.defaultTranslationId);

  findByRubAlHizb = (rubNumber: number): Promise<Verse[]> =>
    queryFindByRubAlHizb(rubNumber, this.defaultTranslationId);

  findSajdahVerses = (): Promise<Verse[]> => queryFindSajdahVerses(this.defaultTranslationId);

  findFirstVerses = (): Promise<Verse[]> => queryFindFirstVerses(this.defaultTranslationId);

  findByVerseKeys = (verseKeys: string[]): Promise<Verse[]> =>
    queryFindByVerseKeys(verseKeys, this.defaultTranslationId);

  findRandom = (count = 1, surahId?: number): Promise<Verse[]> =>
    queryFindRandom(count, surahId, this.defaultTranslationId);

  getTotalCount = (): Promise<number> => queryGetTotalCount();

  getCountBySurah = (surahId: number): Promise<number> =>
    queryGetCountBySurah(surahId, this.defaultTranslationId);

  findNext = (currentVerseId: string): Promise<Verse | null> =>
    queryFindNext(currentVerseId, this.defaultTranslationId);

  findPrevious = (currentVerseId: string): Promise<Verse | null> =>
    queryFindPrevious(currentVerseId, this.defaultTranslationId);

  findWithTranslation = (verseId: string, translationId: number): Promise<Verse | null> =>
    queryFindWithTranslation(verseId, translationId);

  findByRevelationType = async (type: 'makki' | 'madani'): Promise<Verse[]> => {
    try {
      const chapters = await getChapters();
      const place = type === 'makki' ? 'makkah' : 'madinah';
      const surahIds = chapters
        .filter((c) => c.revelation_place.toLowerCase() === place)
        .map((c) => c.id);
      const verses = await Promise.all(
        surahIds.map((id) => queryFindBySurah(id, this.defaultTranslationId))
      );
      return verses.flat();
    } catch (error) {
      logger.error('Failed to find verses by revelation type:', { type }, error as Error);
      return [];
    }
  };

  private static readonly cachePrefix = 'verse-cache-';

  cacheForOffline = async (surahIds?: number[]): Promise<void> => {
    const ids = surahIds?.length ? surahIds : Array.from({ length: 114 }, (_, i) => i + 1);
    for (const id of ids) {
      try {
        const verses = await this.findBySurah(id);
        const serialized = verses.map((v) => v.toPlainObject());
        localStorage.setItem(`${VerseRepository.cachePrefix}${id}`, JSON.stringify(serialized));
      } catch (error) {
        logger.error('Failed to cache verses for offline use:', { surahId: id }, error as Error);
      }
    }
  };

  clearCache = async (): Promise<void> => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(VerseRepository.cachePrefix)) keysToRemove.push(key);
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  };
}
