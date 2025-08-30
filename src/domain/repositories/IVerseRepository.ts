import { Verse } from '../entities/Verse';
import { IRepository } from './IRepository';

/**
 * Search options for verse queries
 */
export interface VerseSearchOptions {
  /** Search query text */
  query?: string;
  /** Translation resource ID to search in */
  translationId?: number;
  /** Language code for translations */
  languageCode?: string;
  /** Maximum number of results */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
  /** Include translations in results */
  includeTranslations?: boolean;
  /** Include audio information in results */
  includeAudio?: boolean;
}

/**
 * Repository interface for Verse domain entity operations.
 * Defines all data access patterns for verses.
 */
export interface IVerseRepository extends IRepository<Verse, string> {
  /**
   * Finds a verse by Surah ID and Ayah number
   */
  findBySurahAndAyah(surahId: number, ayahNumber: number): Promise<Verse | null>;

  /**
   * Finds all verses in a specific Surah
   */
  findBySurah(surahId: number, includeTranslations?: boolean): Promise<Verse[]>;

  /**
   * Finds verses within a range in a specific Surah
   */
  findBySurahRange(
    surahId: number,
    startAyah: number,
    endAyah: number,
    includeTranslations?: boolean
  ): Promise<Verse[]>;

  /**
   * Finds verses in a specific Juz (Para)
   */
  findByJuz(juzNumber: number, includeTranslations?: boolean): Promise<Verse[]>;

  /**
   * Finds verses on a specific page of the Mushaf
   */
  findByPage(pageNumber: number, includeTranslations?: boolean): Promise<Verse[]>;

  /**
   * Finds verses in a specific Hizb
   */
  findByHizb(hizbNumber: number, includeTranslations?: boolean): Promise<Verse[]>;

  /**
   * Finds verses in a specific Rub al Hizb
   */
  findByRubAlHizb(rubNumber: number, includeTranslations?: boolean): Promise<Verse[]>;

  /**
   * Searches verses by text content or translation
   */
  search(options: VerseSearchOptions): Promise<Verse[]>;

  /**
   * Finds verses that require Sajdah (prostration)
   */
  findSajdahVerses(): Promise<Verse[]>;

  /**
   * Finds the first verse of each Surah
   */
  findFirstVerses(): Promise<Verse[]>;

  /**
   * Finds verses by verse keys (e.g., ["1:1", "2:255"])
   */
  findByVerseKeys(verseKeys: string[]): Promise<Verse[]>;

  /**
   * Finds random verses (useful for daily verses, etc.)
   */
  findRandom(count: number, includeTranslations?: boolean): Promise<Verse[]>;

  /**
   * Gets the total count of verses in the Quran
   */
  getTotalCount(): Promise<number>;

  /**
   * Gets the total count of verses in a specific Surah
   */
  getCountBySurah(surahId: number): Promise<number>;

  /**
   * Finds the next verse after a given position
   */
  findNext(surahId: number, ayahNumber: number): Promise<Verse | null>;

  /**
   * Finds the previous verse before a given position
   */
  findPrevious(surahId: number, ayahNumber: number): Promise<Verse | null>;

  /**
   * Finds verses with specific translations
   */
  findWithTranslation(
    translationIds: number[],
    surahId?: number,
    limit?: number,
    offset?: number
  ): Promise<Verse[]>;

  /**
   * Finds verses by revelation type (Makki or Madani)
   */
  findByRevelationType(type: 'makki' | 'madani', limit?: number): Promise<Verse[]>;

  /**
   * Caches verses for offline access
   */
  cacheForOffline(surahIds: number[]): Promise<void>;

  /**
   * Clears cached verses
   */
  clearCache(surahId?: number): Promise<void>;
}
