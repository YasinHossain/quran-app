import { VerseRepository, VerseMapper } from '../../../src/infrastructure/repositories/VerseRepository';
import { QuranApiClient, IHttpClient, ApiVerse } from '../../../src/infrastructure/api/QuranApiClient';
import { MemoryCache } from '../../../src/infrastructure/cache/ICache';

// Mock HTTP Client for testing
class MockHttpClient implements IHttpClient {
  private responses = new Map<string, any>();

  setResponse(url: string, response: any) {
    this.responses.set(url, response);
  }

  async get<T>(url: string): Promise<T> {
    const response = this.responses.get(url);
    if (!response) {
      throw new Error(`No mock response for URL: ${url}`);
    }
    return response;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    throw new Error('POST not implemented in mock');
  }

  async put<T>(url: string, data?: any): Promise<T> {
    throw new Error('PUT not implemented in mock');
  }

  async delete<T>(url: string): Promise<T> {
    throw new Error('DELETE not implemented in mock');
  }
}

describe('VerseRepository Integration Tests', () => {
  let repository: VerseRepository;
  let mockHttpClient: MockHttpClient;
  let cache: MemoryCache;
  let apiClient: QuranApiClient;

  const mockApiVerse: ApiVerse = {
    id: '1:1',
    verse_number: 1,
    chapter_id: 1,
    verse_key: '1:1',
    text_uthmani: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    text_simple: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    translation: {
      id: 1,
      resource_id: 131,
      text: 'In the name of Allah, the Beneficent, the Merciful.',
      language_name: 'english'
    }
  };

  beforeEach(() => {
    mockHttpClient = new MockHttpClient();
    cache = new MemoryCache();
    apiClient = new QuranApiClient('https://api.quran.com/api/v4', mockHttpClient);
    repository = new VerseRepository(apiClient, cache);
  });

  afterEach(async () => {
    await cache.clear();
  });

  describe('VerseMapper', () => {
    it('should map API verse to domain entity correctly', () => {
      const verse = VerseMapper.toDomain(mockApiVerse);

      expect(verse.id).toBe('1:1');
      expect(verse.surahId).toBe(1);
      expect(verse.ayahNumber).toBe(1);
      expect(verse.arabicText).toBe('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ');
      expect(verse.uthmaniText).toBe('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');
      expect(verse.translation).toBeDefined();
      expect(verse.translation!.text).toBe('In the name of Allah, the Beneficent, the Merciful.');
    });

    it('should map API verse without translation correctly', () => {
      const apiVerseNoTranslation = { ...mockApiVerse };
      delete apiVerseNoTranslation.translation;

      const verse = VerseMapper.toDomain(apiVerseNoTranslation);

      expect(verse.translation).toBeUndefined();
    });

    it('should map list of API verses to domain entities', () => {
      const apiVerses = [mockApiVerse, { ...mockApiVerse, id: '1:2', verse_number: 2 }];
      
      const verses = VerseMapper.toDomainList(apiVerses);

      expect(verses).toHaveLength(2);
      expect(verses[0].id).toBe('1:1');
      expect(verses[1].id).toBe('1:2');
    });
  });

  describe('findById', () => {
    it('should find verse by ID successfully', async () => {
      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/verses/by_chapter/1?verse_number=1',
        { verses: [mockApiVerse] }
      );

      const verse = await repository.findById('1:1');

      expect(verse).toBeDefined();
      expect(verse!.id).toBe('1:1');
      expect(verse!.surahId).toBe(1);
      expect(verse!.ayahNumber).toBe(1);
    });

    it('should return null for non-existent verse', async () => {
      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/verses/by_chapter/999?verse_number=999',
        { verses: [] }
      );

      const verse = await repository.findById('999:999');

      expect(verse).toBeNull();
    });

    it('should use cache on second call', async () => {
      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/verses/by_chapter/1?verse_number=1',
        { verses: [mockApiVerse] }
      );

      // First call - should hit API
      const verse1 = await repository.findById('1:1');
      expect(verse1).toBeDefined();

      // Second call - should use cache
      const verse2 = await repository.findById('1:1');
      expect(verse2).toBeDefined();
      expect(verse2!.id).toBe(verse1!.id);

      // Verify cache was used by checking if we can still get the result without setting up the mock again
      const cacheStats = await cache.getStats();
      expect(cacheStats.hits).toBeGreaterThan(0);
    });

    it('should handle different ID formats', async () => {
      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/verses/by_chapter/1?verse_number=1',
        { verses: [mockApiVerse] }
      );

      // Test with verse-1-1 format
      const verse = await repository.findById('verse-1-1');
      expect(verse).toBeDefined();
      expect(verse!.id).toBe('1:1');
    });
  });

  describe('findBySurahAndAyah', () => {
    it('should find verse by surah and ayah', async () => {
      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/verses/by_chapter/1?verse_number=1',
        { verses: [mockApiVerse] }
      );

      const verse = await repository.findBySurahAndAyah(1, 1);

      expect(verse).toBeDefined();
      expect(verse!.surahId).toBe(1);
      expect(verse!.ayahNumber).toBe(1);
    });

    it('should cache the result', async () => {
      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/verses/by_chapter/1?verse_number=1',
        { verses: [mockApiVerse] }
      );

      await repository.findBySurahAndAyah(1, 1);
      
      // Check if cached
      const cached = await cache.has('verse:1:1');
      expect(cached).toBe(true);
    });
  });

  describe('findBySurah', () => {
    it('should find all verses in a surah', async () => {
      const surahVerses = [
        mockApiVerse,
        { ...mockApiVerse, id: '1:2', verse_number: 2 },
        { ...mockApiVerse, id: '1:3', verse_number: 3 }
      ];

      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/verses/by_chapter/1',
        { verses: surahVerses }
      );

      const verses = await repository.findBySurah(1);

      expect(verses).toHaveLength(3);
      expect(verses[0].ayahNumber).toBe(1);
      expect(verses[1].ayahNumber).toBe(2);
      expect(verses[2].ayahNumber).toBe(3);
    });

    it('should find verses with translations when requested', async () => {
      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/verses/by_chapter/1?translations=131',
        { verses: [mockApiVerse] }
      );

      const verses = await repository.findBySurah(1, true);

      expect(verses).toHaveLength(1);
      expect(verses[0].translation).toBeDefined();
    });

    it('should cache surah verses', async () => {
      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/verses/by_chapter/1',
        { verses: [mockApiVerse] }
      );

      await repository.findBySurah(1);
      
      const cached = await cache.has('verse:surah:1:false');
      expect(cached).toBe(true);
    });
  });

  describe('findBySurahRange', () => {
    it('should find verses within a range', async () => {
      const surahVerses = Array.from({ length: 7 }, (_, i) => ({
        ...mockApiVerse,
        id: `1:${i + 1}`,
        verse_number: i + 1
      }));

      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/verses/by_chapter/1',
        { verses: surahVerses }
      );

      const verses = await repository.findBySurahRange(1, 2, 5);

      expect(verses).toHaveLength(4); // verses 2, 3, 4, 5
      expect(verses[0].ayahNumber).toBe(2);
      expect(verses[3].ayahNumber).toBe(5);
    });
  });

  describe('findByPage', () => {
    it('should find verses by page number', async () => {
      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/verses/by_page/1',
        { verses: [mockApiVerse] }
      );

      const verses = await repository.findByPage(1);

      expect(verses).toHaveLength(1);
      expect(verses[0].id).toBe('1:1');
    });
  });

  describe('findByJuz', () => {
    it('should find verses by Juz number', async () => {
      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/verses/by_juz/1',
        { verses: [mockApiVerse] }
      );

      const verses = await repository.findByJuz(1);

      expect(verses).toHaveLength(1);
      expect(verses[0].id).toBe('1:1');
    });
  });

  describe('search', () => {
    it('should search verses by query', async () => {
      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/search?q=Allah&size=20&from=0',
        { search: { results: [mockApiVerse] } }
      );

      const verses = await repository.search({ query: 'Allah' });

      expect(verses).toHaveLength(1);
      expect(verses[0].id).toBe('1:1');
    });

    it('should handle search with pagination', async () => {
      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/search?q=Allah&size=10&from=5',
        { search: { results: [mockApiVerse] } }
      );

      const verses = await repository.search({ 
        query: 'Allah',
        limit: 10,
        offset: 5
      });

      expect(verses).toHaveLength(1);
    });

    it('should return empty array for empty query', async () => {
      const verses = await repository.search({ query: '' });
      expect(verses).toHaveLength(0);
    });
  });

  describe('findSajdahVerses', () => {
    it('should find all sajdah verses', async () => {
      // Mock responses for all sajdah verses
      const sajdahPositions = [
        { surah: 7, ayah: 206 },
        { surah: 13, ayah: 15 },
        { surah: 16, ayah: 50 },
      ];

      sajdahPositions.forEach(({ surah, ayah }) => {
        mockHttpClient.setResponse(
          `https://api.quran.com/api/v4/verses/by_chapter/${surah}?verse_number=${ayah}`,
          { verses: [{ ...mockApiVerse, id: `${surah}:${ayah}`, chapter_id: surah, verse_number: ayah }] }
        );
      });

      const verses = await repository.findSajdahVerses();

      expect(verses.length).toBeGreaterThan(0);
      verses.forEach(verse => {
        expect(verse.isSajdahVerse()).toBe(true);
      });
    });
  });

  describe('findByVerseKeys', () => {
    it('should find verses by verse keys', async () => {
      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/verses/by_chapter/1?verse_number=1',
        { verses: [mockApiVerse] }
      );
      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/verses/by_chapter/2?verse_number=255',
        { verses: [{ ...mockApiVerse, id: '2:255', chapter_id: 2, verse_number: 255 }] }
      );

      const verses = await repository.findByVerseKeys(['1:1', '2:255']);

      expect(verses).toHaveLength(2);
      expect(verses[0].verseKey).toBe('1:1');
      expect(verses[1].verseKey).toBe('2:255');
    });
  });

  describe('getTotalCount', () => {
    it('should return total verse count', async () => {
      const count = await repository.getTotalCount();
      expect(count).toBe(6236);
    });
  });

  describe('getCountBySurah', () => {
    it('should return verse count for a surah', async () => {
      const surahVerses = Array.from({ length: 7 }, (_, i) => ({
        ...mockApiVerse,
        id: `1:${i + 1}`,
        verse_number: i + 1
      }));

      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/verses/by_chapter/1',
        { verses: surahVerses }
      );

      const count = await repository.getCountBySurah(1);
      expect(count).toBe(7);
    });
  });

  describe('findNext', () => {
    it('should find next verse in same surah', async () => {
      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/verses/by_chapter/1?verse_number=2',
        { verses: [{ ...mockApiVerse, id: '1:2', verse_number: 2 }] }
      );

      const nextVerse = await repository.findNext(1, 1);

      expect(nextVerse).toBeDefined();
      expect(nextVerse!.ayahNumber).toBe(2);
    });

    it('should find first verse of next surah when at end of current surah', async () => {
      // Mock no verse found for current surah
      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/verses/by_chapter/1?verse_number=8',
        { verses: [] }
      );
      
      // Mock first verse of next surah
      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/verses/by_chapter/2?verse_number=1',
        { verses: [{ ...mockApiVerse, id: '2:1', chapter_id: 2, verse_number: 1 }] }
      );

      const nextVerse = await repository.findNext(1, 7);

      expect(nextVerse).toBeDefined();
      expect(nextVerse!.surahId).toBe(2);
      expect(nextVerse!.ayahNumber).toBe(1);
    });
  });

  describe('findPrevious', () => {
    it('should find previous verse in same surah', async () => {
      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/verses/by_chapter/1?verse_number=1',
        { verses: [mockApiVerse] }
      );

      const previousVerse = await repository.findPrevious(1, 2);

      expect(previousVerse).toBeDefined();
      expect(previousVerse!.ayahNumber).toBe(1);
    });
  });

  describe('cacheForOffline', () => {
    it('should cache multiple surahs for offline access', async () => {
      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/verses/by_chapter/1?translations=131',
        { verses: [mockApiVerse] }
      );
      mockHttpClient.setResponse(
        'https://api.quran.com/api/v4/verses/by_chapter/2?translations=131',
        { verses: [{ ...mockApiVerse, id: '2:1', chapter_id: 2 }] }
      );

      await repository.cacheForOffline([1, 2]);

      // Check if both surahs are cached
      const surah1Cached = await cache.has('verse:surah:1:true');
      const surah2Cached = await cache.has('verse:surah:2:true');
      
      expect(surah1Cached).toBe(true);
      expect(surah2Cached).toBe(true);
    });
  });

  describe('clearCache', () => {
    it('should clear specific surah cache', async () => {
      // First cache some data
      await cache.set('verse:surah:1:false', [mockApiVerse]);
      await cache.set('verse:surah:1:true', [mockApiVerse]);
      
      await repository.clearCache(1);
      
      const cached1 = await cache.has('verse:surah:1:false');
      const cached2 = await cache.has('verse:surah:1:true');
      
      expect(cached1).toBe(false);
      expect(cached2).toBe(false);
    });

    it('should clear all cache when no surah specified', async () => {
      await cache.set('test-key', 'test-value');
      
      await repository.clearCache();
      
      const hasKey = await cache.has('test-key');
      expect(hasKey).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle API errors gracefully', async () => {
      // Don't set up any mock response, so it will throw an error
      
      const verse = await repository.findById('1:1');
      expect(verse).toBeNull();
    });

    it('should return empty array when search fails', async () => {
      // Don't set up mock response for search
      
      const verses = await repository.search({ query: 'test' });
      expect(verses).toHaveLength(0);
    });
  });
});