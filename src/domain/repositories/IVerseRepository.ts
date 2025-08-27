/**
 * Repository Interface: IVerseRepository
 * 
 * Defines the contract for verse data retrieval from various sources.
 * Abstracts API and caching details from domain logic.
 */

import { Verse } from '../entities/Verse';
import { Word } from '../entities/Word';

export interface VerseQuery {
  surahId?: number;
  ayahNumber?: number;
  verseKey?: string;
  translationIds?: number[];
  wordTranslationLanguage?: string;
  includeWords?: boolean;
  includeAudio?: boolean;
}

export interface PaginationOptions {
  page?: number;
  perPage?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IVerseRepository {
  // Single verse operations
  /**
   * Get a verse by its ID
   */
  getById(id: number, translationIds?: number[]): Promise<Verse | null>;

  /**
   * Get a verse by its key (e.g., "2:255")
   */
  getByKey(verseKey: string, translationIds?: number[]): Promise<Verse | null>;

  /**
   * Get multiple verses by their keys
   */
  getByKeys(verseKeys: string[], translationIds?: number[]): Promise<Verse[]>;

  // Batch verse operations
  /**
   * Get verses by surah (chapter)
   */
  getByChapter(
    chapterId: number, 
    translationIds?: number[],
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<Verse>>;

  /**
   * Get verses by juz (part)
   */
  getByJuz(
    juzId: number,
    translationIds?: number[],
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<Verse>>;

  /**
   * Get verses by page
   */
  getByPage(
    pageId: number,
    translationIds?: number[],
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<Verse>>;

  // Search operations
  /**
   * Search verses by text content
   */
  searchVerses(
    query: string,
    options?: {
      translationIds?: number[];
      searchIn?: 'arabic' | 'translation' | 'both';
      pagination?: PaginationOptions;
    }
  ): Promise<PaginatedResult<Verse>>;

  /**
   * Get random verse
   */
  getRandomVerse(translationIds?: number[]): Promise<Verse>;

  // Metadata operations
  /**
   * Get verse metadata (without full content)
   */
  getVerseMetadata(verseKey: string): Promise<{
    verseKey: string;
    surahId: number;
    ayahNumber: number;
    surahName: string;
    surahNameArabic: string;
  } | null>;

  /**
   * Get multiple verse metadata
   */
  getBulkVerseMetadata(verseKeys: string[]): Promise<Array<{
    verseKey: string;
    surahId: number;
    ayahNumber: number;
    surahName: string;
    surahNameArabic: string;
  }>>;

  // Word-level operations
  /**
   * Get word-by-word data for a verse
   */
  getVerseWords(
    verseKey: string,
    translationLanguage?: string
  ): Promise<Word[]>;

  // Note: Grammar-related methods moved to _future/repositories/IGrammarRepository.ts
  // Can be integrated here when grammar features are implemented

  // Caching operations
  /**
   * Check if verse is cached
   */
  isCached(verseKey: string): Promise<boolean>;

  /**
   * Cache verse data
   */
  cacheVerse(verse: Verse): Promise<void>;

  /**
   * Clear cached data
   */
  clearCache(options?: {
    older_than_days?: number;
    surahId?: number;
  }): Promise<void>;

  /**
   * Get cache statistics
   */
  getCacheStats(): Promise<{
    totalCachedVerses: number;
    cacheSize: number; // bytes
    oldestCacheEntry: number; // timestamp
    newestCacheEntry: number; // timestamp
  }>;

  // Offline operations
  /**
   * Download verses for offline use
   */
  downloadForOffline(
    surahIds: number[],
    translationIds?: number[],
    includeAudio?: boolean
  ): Promise<void>;

  /**
   * Check offline availability
   */
  isAvailableOffline(verseKey: string): Promise<boolean>;

  /**
   * Get offline statistics
   */
  getOfflineStats(): Promise<{
    totalOfflineVerses: number;
    offlineSurahs: number[];
    storageUsed: number; // bytes
  }>;
}