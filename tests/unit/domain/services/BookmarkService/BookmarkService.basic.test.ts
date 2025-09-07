import { Bookmark, Verse } from '../../../../../src/domain/entities';
import {
  BookmarkAlreadyExistsError,
  VerseNotFoundError,
  BookmarkNotFoundError,
  UnauthorizedBookmarkError,
} from '../../../../../src/domain/errors/DomainErrors';
import { BookmarkService } from '../../../../../src/domain/services/BookmarkService';
import { BookmarkPosition } from '../../../../../src/domain/value-objects/BookmarkPosition';
import {
  createMockBookmarkRepository,
  createMockVerseRepository,
  userId,
  surahId,
  ayahNumber,
  verseId,
  bookmarkId,
} from './test-utils';

describe('BookmarkService basic', () => {
  let bookmarkService: BookmarkService;
  let mockBookmarkRepository = createMockBookmarkRepository();
  let mockVerseRepository = createMockVerseRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    mockBookmarkRepository = createMockBookmarkRepository();
    mockVerseRepository = createMockVerseRepository();
    bookmarkService = new BookmarkService(mockBookmarkRepository, mockVerseRepository);
  });

  describe('bookmarkVerse', () => {
    const mockVerse = new Verse(verseId, surahId, ayahNumber, 'text', 'uthmani');

    it('creates bookmark for valid verse', async () => {
      mockVerseRepository.findBySurahAndAyah.mockResolvedValue(mockVerse);
      mockBookmarkRepository.existsAtPosition.mockResolvedValue(false);
      const result = await bookmarkService.bookmarkVerse(userId, surahId, ayahNumber);
      expect(result).toBeInstanceOf(Bookmark);
      expect(mockVerseRepository.findBySurahAndAyah).toHaveBeenCalledWith(surahId, ayahNumber);
      expect(mockBookmarkRepository.save).toHaveBeenCalledWith(result);
    });

    it('creates bookmark with notes and tags', async () => {
      mockVerseRepository.findBySurahAndAyah.mockResolvedValue(mockVerse);
      mockBookmarkRepository.existsAtPosition.mockResolvedValue(false);
      const result = await bookmarkService.bookmarkVerse(userId, surahId, ayahNumber, 'notes', [
        'tag',
      ]);
      expect(result.notes).toBe('notes');
      expect(result.tags).toEqual(['tag']);
    });

    it('throws when verse not found', async () => {
      mockVerseRepository.findBySurahAndAyah.mockResolvedValue(null);
      await expect(bookmarkService.bookmarkVerse(userId, surahId, ayahNumber)).rejects.toThrow(
        VerseNotFoundError
      );
      expect(mockBookmarkRepository.save).not.toHaveBeenCalled();
    });

    it('throws when bookmark exists', async () => {
      mockVerseRepository.findBySurahAndAyah.mockResolvedValue(mockVerse);
      mockBookmarkRepository.existsAtPosition.mockResolvedValue(true);
      await expect(bookmarkService.bookmarkVerse(userId, surahId, ayahNumber)).rejects.toThrow(
        BookmarkAlreadyExistsError
      );
    });
  });

  describe('removeBookmark', () => {
    const mockBookmark = new Bookmark(
      bookmarkId,
      userId,
      verseId,
      new BookmarkPosition(surahId, ayahNumber, new Date()),
      new Date()
    );

    it('removes bookmark', async () => {
      mockBookmarkRepository.findById.mockResolvedValue(mockBookmark);
      await bookmarkService.removeBookmark(userId, bookmarkId);
      expect(mockBookmarkRepository.remove).toHaveBeenCalledWith(bookmarkId);
    });

    it('throws when bookmark missing', async () => {
      mockBookmarkRepository.findById.mockResolvedValue(null);
      await expect(bookmarkService.removeBookmark(userId, bookmarkId)).rejects.toThrow(
        BookmarkNotFoundError
      );
    });

    it('throws when removing others bookmark', async () => {
      const otherBookmark = new Bookmark(
        bookmarkId,
        'other',
        verseId,
        new BookmarkPosition(surahId, ayahNumber, new Date()),
        new Date()
      );
      mockBookmarkRepository.findById.mockResolvedValue(otherBookmark);
      await expect(bookmarkService.removeBookmark(userId, bookmarkId)).rejects.toThrow(
        UnauthorizedBookmarkError
      );
    });
  });

  describe('isVerseBookmarked', () => {
    it('returns true when bookmarked', async () => {
      mockBookmarkRepository.existsAtPosition.mockResolvedValue(true);
      await expect(bookmarkService.isVerseBookmarked(userId, surahId, ayahNumber)).resolves.toBe(
        true
      );
    });

    it('returns false when not bookmarked', async () => {
      mockBookmarkRepository.existsAtPosition.mockResolvedValue(false);
      await expect(bookmarkService.isVerseBookmarked(userId, surahId, ayahNumber)).resolves.toBe(
        false
      );
    });
  });

  describe('getBookmarksWithVerses', () => {
    const mockBookmark = new Bookmark(
      'bookmark123',
      userId,
      verseId,
      new BookmarkPosition(surahId, ayahNumber, new Date()),
      new Date()
    );
    const mockVerse = new Verse(verseId, surahId, ayahNumber, 'text', 'uthmani');

    it('returns bookmarks with verses', async () => {
      mockBookmarkRepository.findByUser.mockResolvedValue([mockBookmark]);
      mockVerseRepository.findById.mockResolvedValue(mockVerse);
      const result = await bookmarkService.getBookmarksWithVerses(userId);
      expect(result[0]).toEqual({ bookmark: mockBookmark, verse: mockVerse });
    });

    it('throws when verse missing', async () => {
      mockBookmarkRepository.findByUser.mockResolvedValue([mockBookmark]);
      mockVerseRepository.findById.mockResolvedValue(null);
      await expect(bookmarkService.getBookmarksWithVerses(userId)).rejects.toThrow(
        VerseNotFoundError
      );
    });

    it('limits results when limit provided', async () => {
      const mockBookmarks = Array.from(
        { length: 10 },
        (_, i) =>
          new Bookmark(
            `b${i}`,
            userId,
            `v${i}`,
            new BookmarkPosition(1, i + 1, new Date()),
            new Date()
          )
      );
      mockBookmarkRepository.findByUser.mockResolvedValue(mockBookmarks);
      mockVerseRepository.findById.mockResolvedValue(mockVerse);
      const result = await bookmarkService.getBookmarksWithVerses(userId, 5);
      expect(mockVerseRepository.findById).toHaveBeenCalledTimes(5);
      expect(result).toHaveLength(5);
    });
  });

  describe('organizeBookmarksBySurah', () => {
    it('organizes and sorts bookmarks', async () => {
      const bookmarks = [
        new Bookmark('b1', userId, 'v1', new BookmarkPosition(1, 3, new Date()), new Date()),
        new Bookmark('b2', userId, 'v2', new BookmarkPosition(1, 1, new Date()), new Date()),
        new Bookmark('b3', userId, 'v3', new BookmarkPosition(2, 5, new Date()), new Date()),
      ];
      mockBookmarkRepository.findByUser.mockResolvedValue(bookmarks);
      const result = await bookmarkService.organizeBookmarksBySurah(userId);
      expect(result.get(1)?.map((b) => b.position.ayahNumber)).toEqual([1, 3]);
      expect(result.get(2)?.length).toBe(1);
    });
  });
});
