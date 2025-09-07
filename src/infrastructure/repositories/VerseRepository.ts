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
import { Verse } from '../../domain/entities';
import { IVerseRepository } from '../../domain/repositories/IVerseRepository';
import { logger } from '../monitoring/Logger';

export class VerseRepository implements IVerseRepository {
  private readonly defaultTranslationId = 20; // Default English translation

  findById = (id: string): Promise<Verse | null> => queryFindById(id, this.defaultTranslationId);

  save = async (_verse: Verse): Promise<void> => {
    logger.warn('Save operation not supported by read-only API');
    throw new Error('Save operation not supported by read-only API');
  };

  remove = async (_id: string): Promise<void> => {
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

  findByRevelationType = async (_type: 'makki' | 'madani'): Promise<Verse[]> => {
    logger.warn('findByRevelationType not fully implemented - requires surah metadata');
    return [];
  };

  cacheForOffline = async (_surahIds?: number[]): Promise<void> => {
    logger.warn('Offline caching not implemented');
  };

  clearCache = async (): Promise<void> => {
    logger.warn('Cache clearing not implemented');
  };
}
