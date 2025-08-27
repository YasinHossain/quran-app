/**
 * Infrastructure: VerseRepository
 * 
 * Implements IVerseRepository using existing Quran.com API client.
 * Wraps existing API functions with domain interfaces.
 */

import { IVerseRepository, VerseQuery, PaginationOptions, PaginatedResult } from '../../domain/repositories';
import { Verse, Word } from '../../domain/entities';
import * as api from '../../../lib/api/verses';
import { getChapters } from '../../../lib/api/chapters';

export class VerseRepository implements IVerseRepository {
  private chapterCache: Map<number, any> = new Map();

  // Single verse operations
  async getById(id: number, translationIds?: number[]): Promise<Verse | null> {
    try {
      const translationId = translationIds?.[0] || 20;
      const apiVerse = await api.getVerseById(id, translationId);
      return Verse.fromApiData(apiVerse);
    } catch (error) {
      console.error(`Failed to get verse by ID ${id}:`, error);
      return null;
    }
  }

  async getByKey(verseKey: string, translationIds?: number[]): Promise<Verse | null> {
    try {
      const translationId = translationIds?.[0] || 20;
      const apiVerse = await api.getVerseByKey(verseKey, translationId);
      return Verse.fromApiData(apiVerse);
    } catch (error) {
      console.error(`Failed to get verse by key ${verseKey}:`, error);
      return null;
    }
  }

  async getByKeys(verseKeys: string[], translationIds?: number[]): Promise<Verse[]> {
    const promises = verseKeys.map(key => this.getByKey(key, translationIds));
    const results = await Promise.allSettled(promises);
    
    return results
      .filter((result): result is PromisedFulfilled<Verse | null> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value!);
  }

  // Batch verse operations
  async getByChapter(
    chapterId: number, 
    translationIds?: number[],
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<Verse>> {
    try {
      const translationId = translationIds?.[0] || 20;
      const page = pagination?.page || 1;
      const perPage = pagination?.perPage || 20;
      
      const result = await api.getVersesByChapter(chapterId, translationId, page, perPage);
      
      const verses = result.verses.map(v => Verse.fromApiData(v));
      const totalPages = result.totalPages;
      
      return {
        data: verses,
        totalCount: totalPages * perPage, // Approximation
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      };
    } catch (error) {
      console.error(`Failed to get verses by chapter ${chapterId}:`, error);
      return this.emptyPaginatedResult();
    }
  }

  async getByJuz(
    juzId: number,
    translationIds?: number[],
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<Verse>> {
    try {
      const translationId = translationIds?.[0] || 20;
      const page = pagination?.page || 1;
      const perPage = pagination?.perPage || 20;
      
      const result = await api.getVersesByJuz(juzId, translationId, page, perPage);
      
      const verses = result.verses.map(v => Verse.fromApiData(v));
      const totalPages = result.totalPages;
      
      return {
        data: verses,
        totalCount: totalPages * perPage, // Approximation
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      };
    } catch (error) {
      console.error(`Failed to get verses by juz ${juzId}:`, error);
      return this.emptyPaginatedResult();
    }
  }

  async getByPage(
    pageId: number,
    translationIds?: number[],
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<Verse>> {
    try {
      const translationId = translationIds?.[0] || 20;
      const page = pagination?.page || 1;
      const perPage = pagination?.perPage || 20;
      
      const result = await api.getVersesByPage(pageId, translationId, page, perPage);
      
      const verses = result.verses.map(v => Verse.fromApiData(v));
      const totalPages = result.totalPages;
      
      return {
        data: verses,
        totalCount: totalPages * perPage, // Approximation
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      };
    } catch (error) {
      console.error(`Failed to get verses by page ${pageId}:`, error);
      return this.emptyPaginatedResult();
    }
  }

  // Search operations
  async searchVerses(
    query: string,
    options?: {
      translationIds?: number[];
      searchIn?: 'arabic' | 'translation' | 'both';
      pagination?: PaginationOptions;
    }
  ): Promise<PaginatedResult<Verse>> {
    try {
      const results = await api.searchVerses(query);
      const verses = results.map(v => Verse.fromApiData(v));
      
      // Simple pagination for search results
      const page = options?.pagination?.page || 1;
      const perPage = options?.pagination?.perPage || 20;
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedVerses = verses.slice(startIndex, endIndex);
      
      return {
        data: paginatedVerses,
        totalCount: verses.length,
        totalPages: Math.ceil(verses.length / perPage),
        currentPage: page,
        hasNextPage: endIndex < verses.length,
        hasPreviousPage: page > 1
      };
    } catch (error) {
      console.error(`Failed to search verses with query "${query}":`, error);
      return this.emptyPaginatedResult();
    }
  }

  async getRandomVerse(translationIds?: number[]): Promise<Verse> {
    try {
      const translationId = translationIds?.[0] || 20;
      const apiVerse = await api.getRandomVerse(translationId);
      return Verse.fromApiData(apiVerse);
    } catch (error) {
      console.error('Failed to get random verse:', error);
      throw error;
    }
  }

  // Metadata operations
  async getVerseMetadata(verseKey: string): Promise<{
    verseKey: string;
    surahId: number;
    ayahNumber: number;
    surahName: string;
    surahNameArabic: string;
  } | null> {
    try {
      const [surahIdStr, ayahNumberStr] = verseKey.split(':');
      const surahId = parseInt(surahIdStr);
      const ayahNumber = parseInt(ayahNumberStr);
      
      // Get chapter info (with caching)
      let chapterInfo = this.chapterCache.get(surahId);
      if (!chapterInfo) {
        const chapters = await getChapters();
        chapters.forEach(chapter => {
          this.chapterCache.set(chapter.id, chapter);
        });
        chapterInfo = this.chapterCache.get(surahId);
      }
      
      return {
        verseKey,
        surahId,
        ayahNumber,
        surahName: chapterInfo?.name_simple || `Surah ${surahId}`,
        surahNameArabic: chapterInfo?.name_arabic || `سورة ${surahId}`
      };
    } catch (error) {
      console.error(`Failed to get verse metadata for ${verseKey}:`, error);
      return null;
    }
  }

  async getBulkVerseMetadata(verseKeys: string[]): Promise<Array<{
    verseKey: string;
    surahId: number;
    ayahNumber: number;
    surahName: string;
    surahNameArabic: string;
  }>> {
    const promises = verseKeys.map(key => this.getVerseMetadata(key));
    const results = await Promise.allSettled(promises);
    
    return results
      .filter((result): result is PromisedFulfilled<any> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);
  }

  // Word-level operations
  async getVerseWords(
    verseKey: string,
    translationLanguage?: string
  ): Promise<Word[]> {
    try {
      const verse = await this.getByKey(verseKey, [20]);
      return verse?.words || [];
    } catch (error) {
      console.error(`Failed to get words for verse ${verseKey}:`, error);
      return [];
    }
  }

  // Note: Grammar-related methods moved to _future/repositories/IGrammarRepository.ts
  // Can be integrated here when grammar features are implemented

  // Caching operations (basic implementation)
  async isCached(verseKey: string): Promise<boolean> {
    // Simple check using localStorage
    const cacheKey = `verse_cache_${verseKey}`;
    return localStorage.getItem(cacheKey) !== null;
  }

  async cacheVerse(verse: Verse): Promise<void> {
    try {
      const cacheKey = `verse_cache_${verse.verse_key}`;
      const cacheData = {
        verse: verse.toStorage(),
        cachedAt: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error(`Failed to cache verse ${verse.verse_key}:`, error);
    }
  }

  async clearCache(options?: {
    older_than_days?: number;
    surahId?: number;
  }): Promise<void> {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('verse_cache_'));
      const cutoffTime = options?.older_than_days 
        ? Date.now() - (options.older_than_days * 24 * 60 * 60 * 1000)
        : 0;

      for (const key of keys) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          const shouldDelete = 
            (cutoffTime > 0 && data.cachedAt < cutoffTime) ||
            (options?.surahId && key.includes(`_${options.surahId}:`));
          
          if (shouldDelete) {
            localStorage.removeItem(key);
          }
        } catch {
          // Remove corrupted cache entries
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Failed to clear verse cache:', error);
    }
  }

  async getCacheStats(): Promise<{
    totalCachedVerses: number;
    cacheSize: number;
    oldestCacheEntry: number;
    newestCacheEntry: number;
  }> {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('verse_cache_'));
    let totalSize = 0;
    let oldestEntry = Date.now();
    let newestEntry = 0;

    for (const key of keys) {
      try {
        const data = localStorage.getItem(key) || '';
        totalSize += data.length;
        
        const cacheData = JSON.parse(data);
        oldestEntry = Math.min(oldestEntry, cacheData.cachedAt || Date.now());
        newestEntry = Math.max(newestEntry, cacheData.cachedAt || 0);
      } catch {
        // Ignore corrupted entries
      }
    }

    return {
      totalCachedVerses: keys.length,
      cacheSize: totalSize,
      oldestCacheEntry: keys.length > 0 ? oldestEntry : Date.now(),
      newestCacheEntry: newestEntry
    };
  }

  // Offline operations (stub implementations for future)
  async downloadForOffline(
    surahIds: number[],
    translationIds?: number[],
    includeAudio?: boolean
  ): Promise<void> {
    console.log(`Offline download requested for surahs: ${surahIds.join(', ')}`);
    // TODO: Implement offline download functionality
  }

  async isAvailableOffline(verseKey: string): Promise<boolean> {
    // For now, just check if it's cached
    return this.isCached(verseKey);
  }

  async getOfflineStats(): Promise<{
    totalOfflineVerses: number;
    offlineSurahs: number[];
    storageUsed: number;
  }> {
    const cacheStats = await this.getCacheStats();
    return {
      totalOfflineVerses: cacheStats.totalCachedVerses,
      offlineSurahs: [], // TODO: Implement surah tracking
      storageUsed: cacheStats.cacheSize
    };
  }

  // Helper methods
  private emptyPaginatedResult<T>(): PaginatedResult<T> {
    return {
      data: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false
    };
  }
}

type PromisedFulfilled<T> = {
  status: 'fulfilled';
  value: T;
};