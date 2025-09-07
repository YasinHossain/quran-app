import { createRepository, mockApiVerse, mockApiVerses, mockApiChapters } from './test-utils';
import { Verse as VerseEntity } from '../../../../src/domain/entities/Verse';
import {
  logger,
  MemoryTransport,
  LogLevel,
} from '../../../../src/infrastructure/monitoring/Logger';

describe('VerseRepository', () => {
  let repository: ReturnType<typeof createRepository>;

  beforeEach(() => {
    repository = createRepository();
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should find verse by ID successfully', async () => {
      mockApiVerses.getVerseById.mockResolvedValue(mockApiVerse);

      const verse = await repository.findById('1:1');

      expect(verse).toBeDefined();
      expect(verse!.id).toBe('1:1');
      expect(verse!.surahId).toBe(1);
      expect(verse!.ayahNumber).toBe(1);
      expect(mockApiVerses.getVerseById).toHaveBeenCalledWith('1:1', 20);
    });

    it('should return null for non-existent verse', async () => {
      mockApiVerses.getVerseById.mockRejectedValue(new Error('Not found'));

      const verse = await repository.findById('999:999');

      expect(verse).toBeNull();
    });
  });

  describe('findBySurahAndAyah', () => {
    it('should find verse by surah and ayah', async () => {
      mockApiVerses.getVerseByKey.mockResolvedValue(mockApiVerse);

      const verse = await repository.findBySurahAndAyah(1, 1);

      expect(verse).toBeDefined();
      expect(verse!.surahId).toBe(1);
      expect(verse!.ayahNumber).toBe(1);
      expect(mockApiVerses.getVerseByKey).toHaveBeenCalledWith('1:1', 20);
    });

    it('should return null if verse not found', async () => {
      mockApiVerses.getVerseByKey.mockRejectedValue(new Error('Not found'));

      const verse = await repository.findBySurahAndAyah(999, 999);

      expect(verse).toBeNull();
    });
  });

  describe('getTotalCount', () => {
    it('should return total verse count', async () => {
      const count = await repository.getTotalCount();
      expect(count).toBe(6236);
    });
  });

  describe('exists', () => {
    it('should return true if verse exists', async () => {
      mockApiVerses.getVerseById.mockResolvedValue(mockApiVerse);

      const exists = await repository.exists('1:1');

      expect(exists).toBe(true);
    });

    it('should return false if verse does not exist', async () => {
      mockApiVerses.getVerseById.mockRejectedValue(new Error('Not found'));

      const exists = await repository.exists('999:999');

      expect(exists).toBe(false);
    });
  });

  describe('unsupported operations', () => {
    it('should throw error for save operation', async () => {
      const mockVerse = new VerseEntity(
        '1:1',
        1,
        1,
        'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'
      );

      await expect(repository.save(mockVerse)).rejects.toThrow(
        'Save operation not supported by read-only API'
      );
    });

    it('should throw error for remove operation', async () => {
      await expect(repository.remove('1:1')).rejects.toThrow(
        'Remove operation not supported by read-only API'
      );
    });
  });

  describe('findSajdahVerses', () => {
    it('should find sajdah verses', async () => {
      mockApiVerses.getVerseByKey
        .mockResolvedValueOnce({ ...mockApiVerse, verse_key: '7:206' })
        .mockResolvedValueOnce({ ...mockApiVerse, verse_key: '13:15' })
        .mockResolvedValueOnce({ ...mockApiVerse, verse_key: '16:50' });

      const sajdahVerses = await repository.findSajdahVerses();

      expect(sajdahVerses.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('findByRevelationType', () => {
    it('should find verses from Makki surahs', async () => {
      mockApiChapters.getChapters.mockResolvedValue([
        {
          id: 1,
          name_simple: 'Al-Fatihah',
          name_arabic: '',
          revelation_place: 'makkah',
          verses_count: 7,
        },
        {
          id: 2,
          name_simple: 'Al-Baqarah',
          name_arabic: '',
          revelation_place: 'madinah',
          verses_count: 286,
        },
      ] as any);
      mockApiVerses.getVersesByChapter.mockResolvedValue({ verses: [mockApiVerse], totalPages: 1 });

      const verses = await repository.findByRevelationType('makki');

      expect(verses).toHaveLength(1);
      expect(mockApiVerses.getVersesByChapter).toHaveBeenCalledWith(1, 20, 1, 300);
    });
  });

  describe('offline caching', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should cache verses for offline use', async () => {
      mockApiVerses.getVersesByChapter.mockResolvedValue({ verses: [mockApiVerse], totalPages: 1 });

      await repository.cacheForOffline([1]);

      const cached = localStorage.getItem('verse-cache-1');
      expect(cached).not.toBeNull();
      const parsed = JSON.parse(cached!);
      expect(parsed).toHaveLength(1);
    });

    it('should clear cached verses', async () => {
      mockApiVerses.getVersesByChapter.mockResolvedValue({ verses: [mockApiVerse], totalPages: 1 });

      await repository.cacheForOffline([1]);
      await repository.clearCache();

      expect(localStorage.getItem('verse-cache-1')).toBeNull();
    });
  });

  describe('logging', () => {
    let memory: MemoryTransport;

    beforeEach(() => {
      memory = new MemoryTransport();
      logger.addTransport(memory);
    });

    afterEach(() => {
      logger.removeTransport(memory);
      memory.clear();
    });

    it('logs warning for unsupported save operation', async () => {
      const verse = new VerseEntity('1:1', 1, 1, '', '');

      await expect(repository.save(verse)).rejects.toThrow(
        'Save operation not supported by read-only API'
      );

      const entries = memory.getEntries();
      expect(entries).toHaveLength(1);
      expect(entries[0].level).toBe(LogLevel.WARN);
      expect(entries[0].message).toBe('Save operation not supported by read-only API');
    });
  });
});
