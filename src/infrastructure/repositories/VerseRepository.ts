import { IVerseRepository } from '../../domain/repositories/IVerseRepository';
import { Verse } from '../../domain/entities/Verse';
import { Translation } from '../../domain/value-objects/Translation';
import * as apiVerses from '../../../lib/api/verses';
import * as apiSearch from '../../../lib/api/verses';
import { Verse as ApiVerse } from '../../../types';
import { logger } from '../monitoring/Logger';

/**
 * Infrastructure implementation of verse repository using Quran.com API
 */
export class VerseRepository implements IVerseRepository {
  private readonly defaultTranslationId = 20; // Default English translation (Sahih International)

  /**
   * Map API verse to domain entity
   */
  private mapApiVerseToDomain(apiVerse: ApiVerse, translationId?: number): Verse {
    const translation = apiVerse.translations?.[0]
      ? new Translation(
          apiVerse.translations[0].id || 0,
          apiVerse.translations[0].resource_id,
          apiVerse.translations[0].text,
          'en'
        )
      : undefined;

    return new Verse(
      apiVerse.verse_key,
      parseInt(apiVerse.verse_key.split(':')[0]),
      parseInt(apiVerse.verse_key.split(':')[1]),
      apiVerse.text_uthmani || '',
      apiVerse.text_uthmani || '',
      translation
    );
  }

  async findById(id: string): Promise<Verse | null> {
    try {
      const apiVerse = await apiVerses.getVerseById(id, this.defaultTranslationId);
      return this.mapApiVerseToDomain(apiVerse);
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
      return this.mapApiVerseToDomain(apiVerse);
    } catch (error) {
      logger.error('Failed to find verse by surah and ayah:', undefined, error as Error);
      return null;
    }
  }

  async findBySurah(surahId: number): Promise<Verse[]> {
    try {
      const response = await apiVerses.getVersesByChapter(
        surahId,
        this.defaultTranslationId,
        1,
        300 // Large page size to get all verses
      );
      return response.verses.map((v) => this.mapApiVerseToDomain(v));
    } catch (error) {
      logger.error('Failed to find verses by surah:', undefined, error as Error);
      return [];
    }
  }

  async findBySurahRange(surahId: number, fromAyah: number, toAyah: number): Promise<Verse[]> {
    try {
      const allVerses = await this.findBySurah(surahId);
      return allVerses.filter((v) => v.ayahNumber >= fromAyah && v.ayahNumber <= toAyah);
    } catch (error) {
      logger.error('Failed to find verses by surah range:', undefined, error as Error);
      return [];
    }
  }

  async findByJuz(juzNumber: number): Promise<Verse[]> {
    try {
      const response = await apiVerses.getVersesByJuz(
        juzNumber,
        this.defaultTranslationId,
        1,
        500 // Large page size for juz
      );
      return response.verses.map((v) => this.mapApiVerseToDomain(v));
    } catch (error) {
      logger.error('Failed to find verses by juz:', undefined, error as Error);
      return [];
    }
  }

  async findByPage(pageNumber: number): Promise<Verse[]> {
    try {
      const response = await apiVerses.getVersesByPage(
        pageNumber,
        this.defaultTranslationId,
        1,
        50 // Typical verses per Mushaf page
      );
      return response.verses.map((v) => this.mapApiVerseToDomain(v));
    } catch (error) {
      logger.error('Failed to find verses by page:', undefined, error as Error);
      return [];
    }
  }

  async findByHizb(hizbNumber: number): Promise<Verse[]> {
    // Hizb calculation: each juz has 2 hizbs
    const juzNumber = Math.ceil(hizbNumber / 2);
    const isSecondHalf = hizbNumber % 2 === 0;

    const juzVerses = await this.findByJuz(juzNumber);
    const mid = Math.floor(juzVerses.length / 2);

    return isSecondHalf ? juzVerses.slice(mid) : juzVerses.slice(0, mid);
  }

  async findByRubAlHizb(rubNumber: number): Promise<Verse[]> {
    // Rub calculation: each hizb has 4 rubs
    const hizbNumber = Math.ceil(rubNumber / 4);
    const rubInHizb = ((rubNumber - 1) % 4) + 1;

    const hizbVerses = await this.findByHizb(hizbNumber);
    const segmentSize = Math.floor(hizbVerses.length / 4);
    const startIndex = (rubInHizb - 1) * segmentSize;
    const endIndex = rubInHizb === 4 ? hizbVerses.length : startIndex + segmentSize;

    return hizbVerses.slice(startIndex, endIndex);
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
      return apiVerses.map((v) => this.mapApiVerseToDomain(v));
    } catch (error) {
      logger.error('Failed to search verses:', undefined, error as Error);
      return [];
    }
  }

  async findSajdahVerses(): Promise<Verse[]> {
    const sajdahPositions = [
      { surah: 7, ayah: 206 },
      { surah: 13, ayah: 15 },
      { surah: 16, ayah: 50 },
      { surah: 17, ayah: 109 },
      { surah: 19, ayah: 58 },
      { surah: 22, ayah: 18 },
      { surah: 22, ayah: 77 },
      { surah: 25, ayah: 60 },
      { surah: 27, ayah: 26 },
      { surah: 32, ayah: 15 },
      { surah: 38, ayah: 24 },
      { surah: 41, ayah: 38 },
      { surah: 53, ayah: 62 },
      { surah: 84, ayah: 21 },
      { surah: 96, ayah: 19 },
    ];

    const verses: Verse[] = [];
    for (const pos of sajdahPositions) {
      const verse = await this.findBySurahAndAyah(pos.surah, pos.ayah);
      if (verse) {
        verses.push(verse);
      }
    }
    return verses;
  }

  async findFirstVerses(): Promise<Verse[]> {
    const verses: Verse[] = [];
    // Get first verse of each surah (1-114)
    for (let surahId = 1; surahId <= 114; surahId++) {
      const verse = await this.findBySurahAndAyah(surahId, 1);
      if (verse) {
        verses.push(verse);
      }
    }
    return verses;
  }

  async findByVerseKeys(verseKeys: string[]): Promise<Verse[]> {
    const verses: Verse[] = [];
    for (const key of verseKeys) {
      try {
        const apiVerse = await apiVerses.getVerseByKey(key, this.defaultTranslationId);
        verses.push(this.mapApiVerseToDomain(apiVerse));
      } catch (error) {
        logger.error(`Failed to fetch verse ${key}:`, undefined, error as Error);
      }
    }
    return verses;
  }

  async findRandom(count: number = 1, surahId?: number): Promise<Verse[]> {
    try {
      const randomVerse = await apiVerses.getRandomVerse(this.defaultTranslationId);
      return [this.mapApiVerseToDomain(randomVerse)];
    } catch (error) {
      logger.error('Failed to find random verse:', undefined, error as Error);
      return [];
    }
  }

  async getTotalCount(): Promise<number> {
    return 6236; // Total verses in the Quran
  }

  async getCountBySurah(surahId: number): Promise<number> {
    try {
      const verses = await this.findBySurah(surahId);
      return verses.length;
    } catch (error) {
      logger.error('Failed to get count by surah:', undefined, error as Error);
      return 0;
    }
  }

  async findNext(currentVerseId: string): Promise<Verse | null> {
    try {
      const current = await this.findById(currentVerseId);
      if (!current) return null;

      // Try next ayah in same surah
      const nextInSurah = await this.findBySurahAndAyah(current.surahId, current.ayahNumber + 1);
      if (nextInSurah) return nextInSurah;

      // Try first ayah of next surah
      if (current.surahId < 114) {
        return await this.findBySurahAndAyah(current.surahId + 1, 1);
      }

      return null; // End of Quran
    } catch (error) {
      logger.error('Failed to find next verse:', undefined, error as Error);
      return null;
    }
  }

  async findPrevious(currentVerseId: string): Promise<Verse | null> {
    try {
      const current = await this.findById(currentVerseId);
      if (!current) return null;

      // Try previous ayah in same surah
      if (current.ayahNumber > 1) {
        return await this.findBySurahAndAyah(current.surahId, current.ayahNumber - 1);
      }

      // Try last ayah of previous surah
      if (current.surahId > 1) {
        const prevSurahVerses = await this.findBySurah(current.surahId - 1);
        return prevSurahVerses[prevSurahVerses.length - 1] || null;
      }

      return null; // Beginning of Quran
    } catch (error) {
      logger.error('Failed to find previous verse:', undefined, error as Error);
      return null;
    }
  }

  async findWithTranslation(verseId: string, translationId: number): Promise<Verse | null> {
    try {
      const apiVerse = await apiVerses.getVerseById(verseId, translationId);
      return this.mapApiVerseToDomain(apiVerse, translationId);
    } catch (error) {
      logger.error('Failed to find verse with translation:', undefined, error as Error);
      return null;
    }
  }

  async findByRevelationType(type: 'makki' | 'madani'): Promise<Verse[]> {
    // This would require surah metadata to determine revelation type
    // For now, return empty array as this requires additional API calls
    logger.warn('findByRevelationType not fully implemented - requires surah metadata');
    return [];
  }

  async cacheForOffline(surahIds?: number[]): Promise<void> {
    // This would be implemented with local storage/IndexedDB
    logger.warn('Offline caching not implemented');
  }

  async clearCache(): Promise<void> {
    // This would be implemented with local storage/IndexedDB
    logger.warn('Cache clearing not implemented');
  }
}
