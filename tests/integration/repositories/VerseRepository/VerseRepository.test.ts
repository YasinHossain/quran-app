import { createRepository, mockApiVerse, mockApiVerses } from './test-utils';
import { logger, MemoryTransport, LogLevel } from '../../../../src/infrastructure/monitoring/Logger';
import { Verse as VerseEntity } from '../../../../src/domain/entities/Verse';

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
      expect(entries[0].message).toBe(
        'Save operation not supported by read-only API'
      );
    });
  });
});
