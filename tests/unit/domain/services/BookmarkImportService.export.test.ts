import { IBookmarkRepository } from '../../../../src/domain/repositories/IBookmarkRepository';
import { IVerseRepository } from '../../../../src/domain/repositories/IVerseRepository';
import { BookmarkImportService } from '../../../../src/domain/services/BookmarkImportService';
import { BookmarkPosition } from '../../../../src/domain/value-objects/BookmarkPosition';
import { StoredBookmark } from '../../../../src/domain/value-objects/StoredBookmark';

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

describe('BookmarkImportService export', () => {
  let importService: BookmarkImportService;
  const userId = 'user123';

  beforeEach(() => {
    jest.clearAllMocks();
    importService = new BookmarkImportService(mockBookmarkRepository, mockVerseRepository);
  });

  it('exports bookmarks in portable format', async () => {
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
