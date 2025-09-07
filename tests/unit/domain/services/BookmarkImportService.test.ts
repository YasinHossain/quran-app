import { Verse } from '../../../../src/domain/entities';
import { IBookmarkRepository } from '../../../../src/domain/repositories/IBookmarkRepository';
import { IVerseRepository } from '../../../../src/domain/repositories/IVerseRepository';
import { BookmarkImportService } from '../../../../src/domain/services/BookmarkImportService';
import { BookmarkPosition } from '../../../../src/domain/value-objects/BookmarkPosition';
import { StoredBookmark } from '../../../../src/domain/value-objects/StoredBookmark';

// Mock repositories
const mockBookmarkRepository: jest.Mocked<IBookmarkRepository> = {
  findById: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  exists: jest.fn(),
  existsByUserAndVerse: jest.fn(),
  findByUser: jest.fn(),
  findByUserWithOptions: jest.fn(),
  findRecent: jest.fn(),
  findByVerse: jest.fn(),
  findBySurah: jest.fn(),
  findBySurahRange: jest.fn(),
  findByPosition: jest.fn(),
  findByTags: jest.fn(),
  findWithNotes: jest.fn(),
  findByDateRange: jest.fn(),
  search: jest.fn(),
  existsAtPosition: jest.fn(),
  getCountByUser: jest.fn(),
  getCountBySurah: jest.fn(),
  getTagsByUser: jest.fn(),
  getStatistics: jest.fn(),
  findNext: jest.fn(),
  findPrevious: jest.fn(),
  findNearPosition: jest.fn(),
  saveMany: jest.fn(),
  removeMany: jest.fn(),
  removeAllByUser: jest.fn(),
  removeBySurah: jest.fn(),
  exportBookmarks: jest.fn(),
  importBookmarks: jest.fn(),
  cacheForOffline: jest.fn(),
  clearCache: jest.fn(),
};

const mockVerseRepository: jest.Mocked<IVerseRepository> = {
  findById: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  exists: jest.fn(),
  findBySurahAndAyah: jest.fn(),
  findBySurah: jest.fn(),
  findBySurahRange: jest.fn(),
  findByJuz: jest.fn(),
  findByPage: jest.fn(),
  findByHizb: jest.fn(),
  findByRubAlHizb: jest.fn(),
  search: jest.fn(),
  findSajdahVerses: jest.fn(),
  findFirstVerses: jest.fn(),
  findByVerseKeys: jest.fn(),
  findRandom: jest.fn(),
  getTotalCount: jest.fn(),
  getCountBySurah: jest.fn(),
  findNext: jest.fn(),
  findPrevious: jest.fn(),
  findWithTranslation: jest.fn(),
  findByRevelationType: jest.fn(),
  cacheForOffline: jest.fn(),
  clearCache: jest.fn(),
};

describe('BookmarkImportService', () => {
  let importService: BookmarkImportService;
  const userId = 'user123';

  beforeEach(() => {
    jest.clearAllMocks();
    importService = new BookmarkImportService(mockBookmarkRepository, mockVerseRepository);
  });

  describe('importBookmarks', () => {
    it('should successfully import valid bookmarks', async () => {
      const importData = [
        { surahId: 1, ayahNumber: 1, notes: 'Opening verse' },
        { surahId: 2, ayahNumber: 255, tags: ['powerful', 'ayat-kursi'] },
      ];
      const mockVerse1 = new Verse('v1', 1, 1, 'text1', 'uthmani1');
      const mockVerse2 = new Verse('v2', 2, 255, 'text2', 'uthmani2');
      mockVerseRepository.findBySurahAndAyah
        .mockResolvedValueOnce(mockVerse1)
        .mockResolvedValueOnce(mockVerse2);
      mockBookmarkRepository.existsAtPosition
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false);
      mockBookmarkRepository.saveMany.mockResolvedValue(undefined);

      const result = await importService.importBookmarks(userId, importData);

      expect(result).toHaveLength(2);
      expect(result[0].notes).toBe('Opening verse');
      expect(result[1].tags).toEqual(['powerful', 'ayat-kursi']);
      expect(mockBookmarkRepository.saveMany).toHaveBeenCalledWith(result);
    });

    it('should skip invalid or existing bookmarks', async () => {
      const importData = [
        { surahId: 1, ayahNumber: 1 },
        { surahId: 999, ayahNumber: 999 },
      ];
      mockVerseRepository.findBySurahAndAyah
        .mockResolvedValueOnce(new Verse('v1', 1, 1, 'text1', 'uthmani1'))
        .mockResolvedValueOnce(null);
      mockBookmarkRepository.existsAtPosition.mockResolvedValueOnce(false);
      mockBookmarkRepository.saveMany.mockResolvedValue(undefined);

      const result = await importService.importBookmarks(userId, importData);

      expect(result).toHaveLength(1);
      expect(mockBookmarkRepository.saveMany).toHaveBeenCalledWith(result);
    });
  });

  describe('exportBookmarks', () => {
    it('should export bookmarks in portable format', async () => {
      const position1 = new BookmarkPosition(1, 1, new Date());
      const now = new Date().toISOString();
      const mockStored: StoredBookmark[] = [
        {
          id: 'b1',
          userId,
          verseId: 'v1',
          position: position1.toPlainObject(),
          createdAt: now,
          tags: [],
        },
      ];
      mockBookmarkRepository.exportBookmarks.mockResolvedValue(mockStored);

      const result = await importService.exportBookmarks(userId);

      expect(mockBookmarkRepository.exportBookmarks).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockStored);
    });
  });
});
