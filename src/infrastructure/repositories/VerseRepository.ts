import * as apiVerses from '../../../lib/api/verses';
import * as apiSearch from '../../../lib/api/verses';
import { Verse } from '../../domain/entities';
import { IVerseRepository } from '../../domain/repositories/IVerseRepository';
import { logger } from '../monitoring/Logger';
import { mapApiVerseToDomain } from './verseMapper';
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
  findNext as queryFindNext,
  findPrevious as queryFindPrevious,
  findWithTranslation as queryFindWithTranslation,
  findByRevelationType as queryFindByRevelationType,
  cacheForOffline as queryCacheForOffline,
  clearCache as queryClearCache,
} from './verseQueries';

/**
 * Infrastructure implementation of verse repository using Quran.com API
 */
export class VerseRepository implements IVerseRepository {
  private readonly defaultTranslationId = 20; // Default English translation (Sahih International)

  async findById(id: string): Promise<Verse | null> {
    try {
      const apiVerse = await apiVerses.getVerseById(id, this.defaultTranslationId);
      return mapApiVerseToDomain(apiVerse);
    } catch (error) {
      logger.error('Failed to find verse by ID:', undefined, error as Error);
      return null;
    }
  }

  async save(verse: Verse): Promise<void> {
    // Note: API is read-only, this would be implemented for local storage/cache
    logger.warn('Save operation not supported by read-only API');
    throw new Error('Save operation not supported by read-only API');
  }

  async remove(id: string): Promise<void> {
    // Note: API is read-only, this would be implemented for local storage/cache
    logger.warn('Remove operation not supported by read-only API');
    throw new Error('Remove operation not supported by read-only API');
  }

  async exists(id: string): Promise<boolean> {
    const verse = await this.findById(id);
    return verse !== null;
  }

  async findBySurahAndAyah(surahId: number, ayahNumber: number): Promise<Verse | null> {
    try {
      const verseKey = `${surahId}:${ayahNumber}`;
      const apiVerse = await apiVerses.getVerseByKey(verseKey, this.defaultTranslationId);
      return mapApiVerseToDomain(apiVerse);
    } catch (error) {
      logger.error('Failed to find verse by surah and ayah:', undefined, error as Error);
      return null;
    }
  }

  async search(
    query: string,
    options?: {
      searchIn?: 'arabic' | 'translation' | 'both';
      translationId?: number;
      surahId?: number;
      limit?: number;
    }
  ): Promise<Verse[]> {
    try {
      const apiVerses = await apiSearch.searchVerses(query);
      return apiVerses.map((v) => mapApiVerseToDomain(v));
    } catch (error) {
      logger.error('Failed to search verses:', undefined, error as Error);
      return [];
    }
  }
  async findBySurah(surahId: number): Promise<Verse[]> {
    return queryFindBySurah(surahId, this.defaultTranslationId);
  }

  async findBySurahRange(
    surahId: number,
    fromAyah: number,
    toAyah: number
  ): Promise<Verse[]> {
    return queryFindBySurahRange(
      surahId,
      fromAyah,
      toAyah,
      this.defaultTranslationId
    );
  }

  async findByJuz(juzNumber: number): Promise<Verse[]> {
    return queryFindByJuz(juzNumber, this.defaultTranslationId);
  }

  async findByPage(pageNumber: number): Promise<Verse[]> {
    return queryFindByPage(pageNumber, this.defaultTranslationId);
  }

  async findByHizb(hizbNumber: number): Promise<Verse[]> {
    return queryFindByHizb(hizbNumber, this.defaultTranslationId);
  }

  async findByRubAlHizb(rubNumber: number): Promise<Verse[]> {
    return queryFindByRubAlHizb(rubNumber, this.defaultTranslationId);
  }

  async findSajdahVerses(): Promise<Verse[]> {
    return queryFindSajdahVerses(this.defaultTranslationId);
  }

  async findFirstVerses(): Promise<Verse[]> {
    return queryFindFirstVerses(this.defaultTranslationId);
  }

  async findByVerseKeys(verseKeys: string[]): Promise<Verse[]> {
    return queryFindByVerseKeys(verseKeys, this.defaultTranslationId);
  }

  async findRandom(count: number = 1, surahId?: number): Promise<Verse[]> {
    return queryFindRandom(count, surahId, this.defaultTranslationId);
  }

  async getTotalCount(): Promise<number> {
    return queryGetTotalCount();
  }

  async getCountBySurah(surahId: number): Promise<number> {
    return queryGetCountBySurah(surahId, this.defaultTranslationId);
  }

  async findNext(currentVerseId: string): Promise<Verse | null> {
    return queryFindNext(currentVerseId, this.defaultTranslationId);
  }

  async findPrevious(currentVerseId: string): Promise<Verse | null> {
    return queryFindPrevious(currentVerseId, this.defaultTranslationId);
  }

  async findWithTranslation(
    verseId: string,
    translationId: number
  ): Promise<Verse | null> {
    return queryFindWithTranslation(verseId, translationId);
  }

  async findByRevelationType(type: 'makki' | 'madani'): Promise<Verse[]> {
    return queryFindByRevelationType(type);
  }

  async cacheForOffline(surahIds?: number[]): Promise<void> {
    return queryCacheForOffline(surahIds);
  }

  async clearCache(): Promise<void> {
    return queryClearCache();
  }
}
