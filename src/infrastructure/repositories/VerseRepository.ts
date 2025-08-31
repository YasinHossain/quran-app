import { Verse, RevelationType } from '../../domain/entities/Verse';
import { Translation } from '../../domain/value-objects/Translation';
import { IVerseRepository, VerseSearchOptions } from '../../domain/repositories/IVerseRepository';
import { QuranApiClient, ApiVerse } from '../api/QuranApiClient';
import { ICache } from '../cache/ICache';

/**
 * Mapper to convert API responses to domain entities
 */
export class VerseMapper {
  /**
   * Maps API verse to domain entity
   */
  static toDomain(apiVerse: ApiVerse): Verse {
    let translation: Translation | undefined;

    if (apiVerse.translation) {
      translation = new Translation(
        apiVerse.translation.id,
        apiVerse.translation.resource_id,
        apiVerse.translation.text,
        apiVerse.translation.language_name || 'en'
      );
    }

    return new Verse(
      apiVerse.id,
      apiVerse.chapter_id,
      apiVerse.verse_number,
      apiVerse.text_simple,
      apiVerse.text_uthmani,
      translation
    );
  }

  /**
   * Maps multiple API verses to domain entities
   */
  static toDomainList(apiVerses: ApiVerse[]): Verse[] {
    return apiVerses.map((apiVerse) => this.toDomain(apiVerse));
  }
}

/**
 * Repository implementation for Verse entities
 */
export class VerseRepository implements IVerseRepository {
  private readonly cachePrefix = 'verse:';
  private readonly cacheTtl = 3600; // 1 hour

  constructor(
    private readonly apiClient: QuranApiClient,
    private readonly cache: ICache
  ) {}

  async findById(id: string): Promise<Verse | null> {
    const cacheKey = `${this.cachePrefix}${id}`;

    // Check cache first
    const cached = await this.cache.get<ApiVerse>(cacheKey);
    if (cached) {
      return VerseMapper.toDomain(cached);
    }

    // Parse verse ID (format: "1:1" or "verse-1-1")
    const verseKey = id.includes(':') ? id : id.replace('verse-', '').replace(/-/g, ':');
    const [surahId, ayahNumber] = verseKey.split(':').map(Number);

    if (!surahId || !ayahNumber) {
      return null;
    }

    try {
      const apiVerse = await this.apiClient.getVerse(surahId, ayahNumber);
      await this.cache.set(cacheKey, apiVerse, this.cacheTtl);
      return VerseMapper.toDomain(apiVerse);
    } catch (error) {
      return null;
    }
  }

  async findAll(): Promise<Verse[]> {
    // This would be expensive to load all verses at once
    // In practice, we'd paginate or have specific use cases
    throw new Error(
      'findAll not implemented for performance reasons. Use specific queries instead.'
    );
  }

  async save(entity: Verse): Promise<Verse> {
    // In a real implementation, this would save to a writable data source
    // For now, we cache the entity
    const cacheKey = `${this.cachePrefix}${entity.id}`;
    const apiVerse: ApiVerse = {
      id: entity.id,
      verse_number: entity.ayahNumber,
      chapter_id: entity.surahId,
      verse_key: entity.verseKey,
      text_uthmani: entity.uthmaniText,
      text_simple: entity.arabicText,
      translation: entity.translation
        ? {
            id: entity.translation.id,
            resource_id: entity.translation.resourceId,
            text: entity.translation.text,
            language_name: entity.translation.languageCode,
          }
        : undefined,
    };

    await this.cache.set(cacheKey, apiVerse, this.cacheTtl);
    return entity;
  }

  async delete(id: string): Promise<void> {
    const cacheKey = `${this.cachePrefix}${id}`;
    await this.cache.delete(cacheKey);
  }

  async findBySurahAndAyah(surahId: number, ayahNumber: number): Promise<Verse | null> {
    const cacheKey = `${this.cachePrefix}${surahId}:${ayahNumber}`;

    // Check cache first
    const cached = await this.cache.get<ApiVerse>(cacheKey);
    if (cached) {
      return VerseMapper.toDomain(cached);
    }

    try {
      const apiVerse = await this.apiClient.getVerse(surahId, ayahNumber);
      await this.cache.set(cacheKey, apiVerse, this.cacheTtl);
      return VerseMapper.toDomain(apiVerse);
    } catch (error) {
      return null;
    }
  }

  async findBySurah(surahId: number, includeTranslations = false): Promise<Verse[]> {
    const cacheKey = `${this.cachePrefix}surah:${surahId}:${includeTranslations}`;

    // Check cache first
    const cached = await this.cache.get<ApiVerse[]>(cacheKey);
    if (cached) {
      return VerseMapper.toDomainList(cached);
    }

    try {
      const apiVerses = await this.apiClient.getVersesBySurah(surahId, includeTranslations);
      await this.cache.set(cacheKey, apiVerses, this.cacheTtl);
      return VerseMapper.toDomainList(apiVerses);
    } catch (error) {
      return [];
    }
  }

  async findBySurahRange(
    surahId: number,
    startAyah: number,
    endAyah: number,
    includeTranslations = false
  ): Promise<Verse[]> {
    const allVerses = await this.findBySurah(surahId, includeTranslations);
    return allVerses.filter(
      (verse) => verse.ayahNumber >= startAyah && verse.ayahNumber <= endAyah
    );
  }

  async findByJuz(juzNumber: number, includeTranslations = false): Promise<Verse[]> {
    const cacheKey = `${this.cachePrefix}juz:${juzNumber}:${includeTranslations}`;

    // Check cache first
    const cached = await this.cache.get<ApiVerse[]>(cacheKey);
    if (cached) {
      return VerseMapper.toDomainList(cached);
    }

    try {
      const apiVerses = await this.apiClient.getVersesByJuz(juzNumber);
      await this.cache.set(cacheKey, apiVerses, this.cacheTtl);
      return VerseMapper.toDomainList(apiVerses);
    } catch (error) {
      return [];
    }
  }

  async findByPage(pageNumber: number, includeTranslations = false): Promise<Verse[]> {
    const cacheKey = `${this.cachePrefix}page:${pageNumber}:${includeTranslations}`;

    // Check cache first
    const cached = await this.cache.get<ApiVerse[]>(cacheKey);
    if (cached) {
      return VerseMapper.toDomainList(cached);
    }

    try {
      const apiVerses = await this.apiClient.getVersesByPage(pageNumber);
      await this.cache.set(cacheKey, apiVerses, this.cacheTtl);
      return VerseMapper.toDomainList(apiVerses);
    } catch (error) {
      return [];
    }
  }

  async findByHizb(hizbNumber: number, includeTranslations = false): Promise<Verse[]> {
    // Hizb calculation: each juz has 2 hizbs, so hizb N spans verses in juz Math.ceil(N/2)
    const juzNumber = Math.ceil(hizbNumber / 2);
    const allJuzVerses = await this.findByJuz(juzNumber, includeTranslations);

    // For simplicity, return half of the juz verses (this would be more complex in reality)
    const isFirstHalf = hizbNumber % 2 === 1;
    const half = Math.ceil(allJuzVerses.length / 2);

    return isFirstHalf ? allJuzVerses.slice(0, half) : allJuzVerses.slice(half);
  }

  async findByRubAlHizb(rubNumber: number, includeTranslations = false): Promise<Verse[]> {
    // Each hizb has 4 rub al hizbs, so rub N is in hizb Math.ceil(N/4)
    const hizbNumber = Math.ceil(rubNumber / 4);
    const allHizbVerses = await this.findByHizb(hizbNumber, includeTranslations);

    // Return a quarter of the hizb verses
    const quarter = Math.ceil(allHizbVerses.length / 4);
    const startIndex = ((rubNumber - 1) % 4) * quarter;

    return allHizbVerses.slice(startIndex, startIndex + quarter);
  }

  async search(options: VerseSearchOptions): Promise<Verse[]> {
    if (!options.query) {
      return [];
    }

    const cacheKey = `${this.cachePrefix}search:${JSON.stringify(options)}`;

    // Check cache first
    const cached = await this.cache.get<ApiVerse[]>(cacheKey);
    if (cached) {
      return VerseMapper.toDomainList(cached);
    }

    try {
      const apiVerses = await this.apiClient.searchVerses(
        options.query,
        options.limit || 20,
        options.offset || 0
      );

      await this.cache.set(cacheKey, apiVerses, this.cacheTtl);
      return VerseMapper.toDomainList(apiVerses);
    } catch (error) {
      return [];
    }
  }

  async findSajdahVerses(): Promise<Verse[]> {
    const cacheKey = `${this.cachePrefix}sajdah`;

    // Check cache first
    const cached = await this.cache.get<Verse[]>(cacheKey);
    if (cached) {
      return cached;
    }

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

    const sajdahVerses: Verse[] = [];

    for (const { surah, ayah } of sajdahPositions) {
      const verse = await this.findBySurahAndAyah(surah, ayah);
      if (verse) {
        sajdahVerses.push(verse);
      }
    }

    await this.cache.set(cacheKey, sajdahVerses, this.cacheTtl * 24); // Cache for 24 hours
    return sajdahVerses;
  }

  async findFirstVerses(): Promise<Verse[]> {
    const cacheKey = `${this.cachePrefix}first_verses`;

    // Check cache first
    const cached = await this.cache.get<Verse[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const firstVerses: Verse[] = [];

    // Get first verse of each surah (1-114)
    for (let surahId = 1; surahId <= 114; surahId++) {
      const verse = await this.findBySurahAndAyah(surahId, 1);
      if (verse) {
        firstVerses.push(verse);
      }
    }

    await this.cache.set(cacheKey, firstVerses, this.cacheTtl * 24); // Cache for 24 hours
    return firstVerses;
  }

  async findByVerseKeys(verseKeys: string[]): Promise<Verse[]> {
    const verses: Verse[] = [];

    for (const verseKey of verseKeys) {
      const [surahId, ayahNumber] = verseKey.split(':').map(Number);
      if (surahId && ayahNumber) {
        const verse = await this.findBySurahAndAyah(surahId, ayahNumber);
        if (verse) {
          verses.push(verse);
        }
      }
    }

    return verses;
  }

  async findRandom(count: number, includeTranslations = false): Promise<Verse[]> {
    try {
      const apiVerses = await this.apiClient.getRandomVerses(count);
      const verses = VerseMapper.toDomainList(apiVerses);

      // If we got fewer verses than requested, try to get more
      if (verses.length < count) {
        console.warn(`Only received ${verses.length} out of ${count} requested random verses`);
      }

      return verses;
    } catch (error) {
      console.error('Failed to fetch random verses:', error);
      return [];
    }
  }

  async getTotalCount(): Promise<number> {
    // Total verses in the Quran is 6236
    return 6236;
  }

  async getCountBySurah(surahId: number): Promise<number> {
    const verses = await this.findBySurah(surahId);
    return verses.length;
  }

  async findNext(surahId: number, ayahNumber: number): Promise<Verse | null> {
    // Try next ayah in same surah first
    const nextInSurah = await this.findBySurahAndAyah(surahId, ayahNumber + 1);
    if (nextInSurah) {
      return nextInSurah;
    }

    // If no next ayah in current surah, try first ayah of next surah
    if (surahId < 114) {
      return await this.findBySurahAndAyah(surahId + 1, 1);
    }

    return null; // End of Quran
  }

  async findPrevious(surahId: number, ayahNumber: number): Promise<Verse | null> {
    // Try previous ayah in same surah first
    if (ayahNumber > 1) {
      return await this.findBySurahAndAyah(surahId, ayahNumber - 1);
    }

    // If first ayah of current surah, find last ayah of previous surah
    if (surahId > 1) {
      const previousSurahVerses = await this.findBySurah(surahId - 1);
      if (previousSurahVerses.length > 0) {
        return previousSurahVerses[previousSurahVerses.length - 1];
      }
    }

    return null; // Beginning of Quran
  }

  async findWithTranslation(
    translationIds: number[],
    surahId?: number,
    limit = 20,
    offset = 0
  ): Promise<Verse[]> {
    // For simplicity, this implementation just returns verses with translations
    // A full implementation would fetch specific translations

    if (surahId) {
      return await this.findBySurah(surahId, true);
    }

    // Return random verses with translations
    return await this.findRandom(limit, true);
  }

  async findByRevelationType(type: 'makki' | 'madani', limit = 20): Promise<Verse[]> {
    // This would require surah revelation type data to filter verses
    // For now, return a sample from known surahs of that type

    const makkiSurahs = [1, 6, 7, 10, 11, 12, 15]; // Sample Makki surahs
    const madaniSurahs = [2, 3, 4, 5, 8, 9]; // Sample Madani surahs

    const surahs = type === 'makki' ? makkiSurahs : madaniSurahs;
    const verses: Verse[] = [];

    for (const surahId of surahs.slice(0, Math.min(surahs.length, limit))) {
      const firstVerse = await this.findBySurahAndAyah(surahId, 1);
      if (firstVerse) {
        verses.push(firstVerse);
      }
    }

    return verses;
  }

  async cacheForOffline(surahIds: number[]): Promise<void> {
    for (const surahId of surahIds) {
      await this.findBySurah(surahId, true); // This will cache the verses
    }
  }

  async clearCache(surahId?: number): Promise<void> {
    if (surahId) {
      // Clear specific surah cache
      await this.cache.delete(`${this.cachePrefix}surah:${surahId}:false`);
      await this.cache.delete(`${this.cachePrefix}surah:${surahId}:true`);
    } else {
      // Clear all cache (this would be more sophisticated in a real implementation)
      await this.cache.clear();
    }
  }
}
