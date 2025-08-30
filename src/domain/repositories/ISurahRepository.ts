import { Surah, RevelationType } from '../entities/Surah';
import { IRepository } from './IRepository';

/**
 * Search options for Surah queries
 */
export interface SurahSearchOptions {
  /** Search query text */
  query?: string;
  /** Language for name search ('en', 'ar') */
  language?: 'en' | 'ar';
  /** Filter by revelation type */
  revelationType?: RevelationType;
  /** Filter by verse count range */
  minVerses?: number;
  maxVerses?: number;
  /** Maximum number of results */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
}

/**
 * Repository interface for Surah domain entity operations.
 * Defines all data access patterns for Surahs.
 */
export interface ISurahRepository extends IRepository<Surah, number> {
  /**
   * Finds all Surahs in the Quran (1-114)
   */
  findAll(): Promise<Surah[]>;

  /**
   * Finds Surahs by revelation type (Makki or Madani)
   */
  findByRevelationType(type: RevelationType): Promise<Surah[]>;

  /**
   * Finds Surahs by name (Arabic or English)
   */
  findByName(name: string, language?: 'en' | 'ar'): Promise<Surah[]>;

  /**
   * Finds Surahs within a verse count range
   */
  findByVerseCountRange(minVerses: number, maxVerses: number): Promise<Surah[]>;

  /**
   * Finds short Surahs (typically less than 20 verses)
   */
  findShortSurahs(): Promise<Surah[]>;

  /**
   * Finds medium-length Surahs (typically 20-100 verses)
   */
  findMediumSurahs(): Promise<Surah[]>;

  /**
   * Finds long Surahs (typically more than 100 verses)
   */
  findLongSurahs(): Promise<Surah[]>;

  /**
   * Finds the Seven Long Surahs (As-Sab' at-Tiwal)
   */
  findSevenLongSurahs(): Promise<Surah[]>;

  /**
   * Finds Mufassal Surahs (detailed surahs, typically from 49-114)
   */
  findMufassalSurahs(): Promise<Surah[]>;

  /**
   * Finds Surahs by revelation order
   */
  findByRevelationOrder(order: number): Promise<Surah | null>;

  /**
   * Finds Surahs in revelation order (chronological)
   */
  findAllByRevelationOrder(): Promise<Surah[]>;

  /**
   * Finds Surahs that contain a specific Juz (Para)
   */
  findByJuz(juzNumber: number): Promise<Surah[]>;

  /**
   * Searches Surahs based on various criteria
   */
  search(options: SurahSearchOptions): Promise<Surah[]>;

  /**
   * Finds the next Surah after a given Surah
   */
  findNext(surahId: number): Promise<Surah | null>;

  /**
   * Finds the previous Surah before a given Surah
   */
  findPrevious(surahId: number): Promise<Surah | null>;

  /**
   * Finds Surahs suitable for memorization based on difficulty
   */
  findForMemorization(difficulty: 'easy' | 'medium' | 'hard'): Promise<Surah[]>;

  /**
   * Finds Surahs commonly recited in prayers
   */
  findCommonlyRecited(): Promise<Surah[]>;

  /**
   * Finds Surahs that start with specific letters (Muqatta'at)
   */
  findWithMuqattaat(): Promise<Surah[]>;

  /**
   * Gets statistics about all Surahs
   */
  getStatistics(): Promise<{
    totalSurahs: number;
    totalVerses: number;
    makkiCount: number;
    madaniCount: number;
    averageVerses: number;
    shortestSurah: Surah;
    longestSurah: Surah;
  }>;

  /**
   * Gets the total count of Surahs (should always be 114)
   */
  getTotalCount(): Promise<number>;

  /**
   * Caches Surahs for offline access
   */
  cacheForOffline(): Promise<void>;

  /**
   * Clears cached Surahs
   */
  clearCache(): Promise<void>;
}
