import { Bookmark } from '../../../../src/domain/entities/Bookmark';
import { Verse } from '../../../../src/domain/entities/Verse';
import {
  BookmarkAlreadyExistsError,
  VerseNotFoundError,
  BookmarkNotFoundError,
  UnauthorizedBookmarkError,
} from '../../../../src/domain/errors/DomainErrors';
import { IBookmarkRepository } from '../../../../src/domain/repositories/IBookmarkRepository';
import { IVerseRepository } from '../../../../src/domain/repositories/IVerseRepository';
import { BookmarkService } from '../../../../src/domain/services/BookmarkService';
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

describe('BookmarkService', () => {
  let bookmarkService: BookmarkService;
  const userId = 'user123';
  const surahId = 1;
  const ayahNumber = 1;
  const verseId = 'verse-1-1';

  beforeEach(() => {
    jest.clearAllMocks();
    bookmarkService = new BookmarkService(mockBookmarkRepository, mockVerseRepository);
  });

  describe('bookmarkVerse', () => {
    const mockVerse = new Verse(
      verseId,
      surahId,
      ayahNumber,
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'
    );

    it('should successfully create a bookmark for a valid verse', async () => {
      mockVerseRepository.findBySurahAndAyah.mockResolvedValue(mockVerse);
      mockBookmarkRepository.existsAtPosition.mockResolvedValue(false);
      mockBookmarkRepository.save.mockResolvedValue(undefined);

      const result = await bookmarkService.bookmarkVerse(userId, surahId, ayahNumber);

      expect(result).toBeInstanceOf(Bookmark);
      expect(result.userId).toBe(userId);
      expect(result.verseId).toBe(verseId);
      expect(result.position.surahId).toBe(surahId);
      expect(result.position.ayahNumber).toBe(ayahNumber);
      expect(mockVerseRepository.findBySurahAndAyah).toHaveBeenCalledWith(surahId, ayahNumber);
      expect(mockBookmarkRepository.existsAtPosition).toHaveBeenCalled();
      expect(mockBookmarkRepository.save).toHaveBeenCalledWith(result);
    });

    it('should create bookmark with notes and tags', async () => {
      mockVerseRepository.findBySurahAndAyah.mockResolvedValue(mockVerse);
      mockBookmarkRepository.existsAtPosition.mockResolvedValue(false);
      mockBookmarkRepository.save.mockResolvedValue(undefined);

      const notes = 'Beautiful opening verse';
      const tags = ['opening', 'bismillah'];

      const result = await bookmarkService.bookmarkVerse(userId, surahId, ayahNumber, notes, tags);

      expect(result.notes).toBe(notes);
      expect(result.tags).toEqual(tags);
    });

    it('should throw VerseNotFoundError when verse does not exist', async () => {
      mockVerseRepository.findBySurahAndAyah.mockResolvedValue(null);

      await expect(bookmarkService.bookmarkVerse(userId, surahId, ayahNumber)).rejects.toThrow(
        VerseNotFoundError
      );

      expect(mockVerseRepository.findBySurahAndAyah).toHaveBeenCalledWith(surahId, ayahNumber);
      expect(mockBookmarkRepository.existsAtPosition).not.toHaveBeenCalled();
      expect(mockBookmarkRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BookmarkAlreadyExistsError when bookmark already exists', async () => {
      mockVerseRepository.findBySurahAndAyah.mockResolvedValue(mockVerse);
      mockBookmarkRepository.existsAtPosition.mockResolvedValue(true);

      await expect(bookmarkService.bookmarkVerse(userId, surahId, ayahNumber)).rejects.toThrow(
        BookmarkAlreadyExistsError
      );

      expect(mockVerseRepository.findBySurahAndAyah).toHaveBeenCalledWith(surahId, ayahNumber);
      expect(mockBookmarkRepository.existsAtPosition).toHaveBeenCalled();
      expect(mockBookmarkRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('removeBookmark', () => {
    const bookmarkId = 'bookmark123';
    const mockBookmark = new Bookmark(
      bookmarkId,
      userId,
      verseId,
      new BookmarkPosition(surahId, ayahNumber, new Date()),
      new Date()
    );

    it('should successfully remove a bookmark', async () => {
      mockBookmarkRepository.findById.mockResolvedValue(mockBookmark);
      mockBookmarkRepository.remove.mockResolvedValue(undefined);

      await bookmarkService.removeBookmark(userId, bookmarkId);

      expect(mockBookmarkRepository.findById).toHaveBeenCalledWith(bookmarkId);
      expect(mockBookmarkRepository.remove).toHaveBeenCalledWith(bookmarkId);
    });

    it('should throw BookmarkNotFoundError when bookmark does not exist', async () => {
      mockBookmarkRepository.findById.mockResolvedValue(null);

      await expect(bookmarkService.removeBookmark(userId, bookmarkId)).rejects.toThrow(
        BookmarkNotFoundError
      );

      expect(mockBookmarkRepository.findById).toHaveBeenCalledWith(bookmarkId);
      expect(mockBookmarkRepository.remove).not.toHaveBeenCalled();
    });

    it("should throw error when trying to remove another user's bookmark", async () => {
      const otherUserBookmark = new Bookmark(
        bookmarkId,
        'otherUser',
        verseId,
        new BookmarkPosition(surahId, ayahNumber, new Date()),
        new Date()
      );
      mockBookmarkRepository.findById.mockResolvedValue(otherUserBookmark);

      await expect(bookmarkService.removeBookmark(userId, bookmarkId)).rejects.toThrow(
        UnauthorizedBookmarkError
      );

      expect(mockBookmarkRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('isVerseBookmarked', () => {
    it('should return true when verse is bookmarked', async () => {
      mockBookmarkRepository.existsAtPosition.mockResolvedValue(true);

      const result = await bookmarkService.isVerseBookmarked(userId, surahId, ayahNumber);

      expect(result).toBe(true);
      expect(mockBookmarkRepository.existsAtPosition).toHaveBeenCalled();
    });

    it('should return false when verse is not bookmarked', async () => {
      mockBookmarkRepository.existsAtPosition.mockResolvedValue(false);

      const result = await bookmarkService.isVerseBookmarked(userId, surahId, ayahNumber);

      expect(result).toBe(false);
      expect(mockBookmarkRepository.existsAtPosition).toHaveBeenCalled();
    });
  });

  describe('getBookmarksWithVerses', () => {
    it('should return bookmarks with their corresponding verses', async () => {
      const mockBookmark = new Bookmark(
        'bookmark123',
        userId,
        verseId,
        new BookmarkPosition(surahId, ayahNumber, new Date()),
        new Date()
      );
      const mockVerse = new Verse(
        verseId,
        surahId,
        ayahNumber,
        'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'
      );

      mockBookmarkRepository.findByUser.mockResolvedValue([mockBookmark]);
      mockVerseRepository.findById.mockResolvedValue(mockVerse);

      const result = await bookmarkService.getBookmarksWithVerses(userId);

      expect(result).toHaveLength(1);
      expect(result[0].bookmark).toBe(mockBookmark);
      expect(result[0].verse).toBe(mockVerse);
      expect(mockBookmarkRepository.findByUser).toHaveBeenCalledWith(userId);
      expect(mockVerseRepository.findById).toHaveBeenCalledWith(verseId);
    });

    it('should throw VerseNotFoundError when verse does not exist', async () => {
      const mockBookmark = new Bookmark(
        'bookmark123',
        userId,
        verseId,
        new BookmarkPosition(surahId, ayahNumber, new Date()),
        new Date()
      );

      mockBookmarkRepository.findByUser.mockResolvedValue([mockBookmark]);
      mockVerseRepository.findById.mockResolvedValue(null);

      await expect(bookmarkService.getBookmarksWithVerses(userId)).rejects.toThrow(
        VerseNotFoundError
      );
    });

    it('should limit results when limit is provided', async () => {
      const mockBookmarks = Array.from(
        { length: 10 },
        (_, i) =>
          new Bookmark(
            `bookmark${i}`,
            userId,
            `verse-${i}`,
            new BookmarkPosition(1, i + 1, new Date()),
            new Date()
          )
      );

      mockBookmarkRepository.findByUser.mockResolvedValue(mockBookmarks);
      mockVerseRepository.findById.mockResolvedValue(new Verse('verse-0', 1, 1, 'text', 'uthmani'));

      const result = await bookmarkService.getBookmarksWithVerses(userId, 5);

      expect(mockVerseRepository.findById).toHaveBeenCalledTimes(5);
      expect(result).toHaveLength(5);
    });
  });

  describe('organizeBookmarksBySurah', () => {
    it('should organize bookmarks by Surah and sort by ayah number', async () => {
      const mockBookmarks = [
        new Bookmark('b1', userId, 'v1', new BookmarkPosition(1, 3, new Date()), new Date()),
        new Bookmark('b2', userId, 'v2', new BookmarkPosition(1, 1, new Date()), new Date()),
        new Bookmark('b3', userId, 'v3', new BookmarkPosition(2, 5, new Date()), new Date()),
        new Bookmark('b4', userId, 'v4', new BookmarkPosition(1, 7, new Date()), new Date()),
        new Bookmark('b5', userId, 'v5', new BookmarkPosition(2, 1, new Date()), new Date()),
      ];

      mockBookmarkRepository.findByUser.mockResolvedValue(mockBookmarks);

      const result = await bookmarkService.organizeBookmarksBySurah(userId);

      expect(result.size).toBe(2);

      const surah1Bookmarks = result.get(1)!;
      expect(surah1Bookmarks).toHaveLength(3);
      expect(surah1Bookmarks[0].position.ayahNumber).toBe(1);
      expect(surah1Bookmarks[1].position.ayahNumber).toBe(3);
      expect(surah1Bookmarks[2].position.ayahNumber).toBe(7);

      const surah2Bookmarks = result.get(2)!;
      expect(surah2Bookmarks).toHaveLength(2);
      expect(surah2Bookmarks[0].position.ayahNumber).toBe(1);
      expect(surah2Bookmarks[1].position.ayahNumber).toBe(5);
    });
  });

});
