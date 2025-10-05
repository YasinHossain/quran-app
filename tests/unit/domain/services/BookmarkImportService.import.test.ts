import { Verse } from '@/src/domain/entities';
import { IBookmarkRepository } from '@/src/domain/repositories/IBookmarkRepository';
import { IVerseRepository } from '@/src/domain/repositories/IVerseRepository';
import { BookmarkImportService } from '@/src/domain/services/BookmarkImportService';

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

const setupFindBySurahAndAyahMocks = (verses: Array<Verse | null>): void => {
  verses.forEach((verse) => mockVerseRepository.findBySurahAndAyah.mockResolvedValueOnce(verse));
};

const setupExistsAtPositionMocks = (values: boolean[]): void => {
  values.forEach((value) => mockBookmarkRepository.existsAtPosition.mockResolvedValueOnce(value));
};

const createVerse = (id: string, surahId: number, ayahNumber: number): Verse =>
  new Verse({
    id,
    surahId,
    ayahNumber,
    arabicText: `text${id}`,
    uthmaniText: `uthmani${id}`,
  });

describe('BookmarkImportService import', () => {
  let importService: BookmarkImportService;
  const userId = 'user123';

  beforeEach(() => {
    jest.clearAllMocks();
    importService = new BookmarkImportService(mockBookmarkRepository, mockVerseRepository);
    mockBookmarkRepository.saveMany.mockResolvedValue(undefined);
  });

  it('successfully imports valid bookmarks', async () => {
    const importData = [
      { surahId: 1, ayahNumber: 1, notes: 'Opening verse' },
      { surahId: 2, ayahNumber: 255, tags: ['powerful', 'ayat-kursi'] },
    ];
    const mockVerse1 = createVerse('v1', 1, 1);
    const mockVerse2 = createVerse('v2', 2, 255);
    setupFindBySurahAndAyahMocks([mockVerse1, mockVerse2]);
    setupExistsAtPositionMocks([false, false]);

    const result = await importService.importBookmarks(userId, importData);

    expect(result).toHaveLength(2);
    expect(result[0].notes).toBe('Opening verse');
    expect(result[1].tags).toEqual(['powerful', 'ayat-kursi']);
    expect(mockBookmarkRepository.saveMany).toHaveBeenCalledWith(result);
  });

  it('skips invalid or existing bookmarks', async () => {
    const importData = [
      { surahId: 1, ayahNumber: 1 },
      { surahId: 999, ayahNumber: 999 },
    ];
    setupFindBySurahAndAyahMocks([createVerse('v1', 1, 1), null]);
    setupExistsAtPositionMocks([false]);

    const result = await importService.importBookmarks(userId, importData);

    expect(result).toHaveLength(1);
    expect(mockBookmarkRepository.saveMany).toHaveBeenCalledWith(result);
  });
});
