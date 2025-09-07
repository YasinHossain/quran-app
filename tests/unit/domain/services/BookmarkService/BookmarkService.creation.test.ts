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

describe('BookmarkService creation', () => {
  let service: BookmarkService;
  let mockBookmarkRepo = createMockBookmarkRepository();
  let mockVerseRepo = createMockVerseRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    mockBookmarkRepo = createMockBookmarkRepository();
    mockVerseRepo = createMockVerseRepository();
    service = new BookmarkService(mockBookmarkRepo, mockVerseRepo);
  });

  describe('bookmarkVerse', () => {
    const verse = new Verse(verseId, surahId, ayahNumber, 'text', 'uthmani');

    it('creates bookmark for valid verse', async () => {
      mockVerseRepo.findBySurahAndAyah.mockResolvedValue(verse);
      mockBookmarkRepo.existsAtPosition.mockResolvedValue(false);
      const result = await service.bookmarkVerse(userId, surahId, ayahNumber, 'note', ['tag']);
      expect(result).toBeInstanceOf(Bookmark);
      expect(result.notes).toBe('note');
      expect(result.tags).toEqual(['tag']);
    });

    it('throws when verse missing', async () => {
      mockVerseRepo.findBySurahAndAyah.mockResolvedValue(null);
      await expect(service.bookmarkVerse(userId, surahId, ayahNumber)).rejects.toThrow(
        VerseNotFoundError
      );
    });

    it('throws when bookmark exists', async () => {
      mockVerseRepo.findBySurahAndAyah.mockResolvedValue(verse);
      mockBookmarkRepo.existsAtPosition.mockResolvedValue(true);
      await expect(service.bookmarkVerse(userId, surahId, ayahNumber)).rejects.toThrow(
        BookmarkAlreadyExistsError
      );
    });
  });

  describe('removeBookmark', () => {
    const base = new Bookmark(
      bookmarkId,
      userId,
      verseId,
      new BookmarkPosition(surahId, ayahNumber, new Date()),
      new Date()
    );

    it('removes bookmark', async () => {
      mockBookmarkRepo.findById.mockResolvedValue(base);
      await service.removeBookmark(userId, bookmarkId);
      expect(mockBookmarkRepo.remove).toHaveBeenCalledWith(bookmarkId);
    });

    it('throws when missing', async () => {
      mockBookmarkRepo.findById.mockResolvedValue(null);
      await expect(service.removeBookmark(userId, bookmarkId)).rejects.toThrow(
        BookmarkNotFoundError
      );
    });

    it('throws on unauthorized removal', async () => {
      const other = new Bookmark(
        bookmarkId,
        'other',
        verseId,
        new BookmarkPosition(surahId, ayahNumber, new Date()),
        new Date()
      );
      mockBookmarkRepo.findById.mockResolvedValue(other);
      await expect(service.removeBookmark(userId, bookmarkId)).rejects.toThrow(
        UnauthorizedBookmarkError
      );
    });
  });

  describe('isVerseBookmarked', () => {
    it('returns true when bookmarked', async () => {
      mockBookmarkRepo.existsAtPosition.mockResolvedValue(true);
      await expect(service.isVerseBookmarked(userId, surahId, ayahNumber)).resolves.toBe(true);
    });

    it('returns false when not bookmarked', async () => {
      mockBookmarkRepo.existsAtPosition.mockResolvedValue(false);
      await expect(service.isVerseBookmarked(userId, surahId, ayahNumber)).resolves.toBe(false);
    });
  });

  describe('getBookmarksWithVerses', () => {
    const base = new Bookmark(
      bookmarkId,
      userId,
      verseId,
      new BookmarkPosition(surahId, ayahNumber, new Date()),
      new Date()
    );
    const verse = new Verse(verseId, surahId, ayahNumber, 'text', 'uthmani');

    it('returns bookmarks with verses', async () => {
      mockBookmarkRepo.findByUser.mockResolvedValue([base]);
      mockVerseRepo.findById.mockResolvedValue(verse);
      const result = await service.getBookmarksWithVerses(userId);
      expect(result[0]).toEqual({ bookmark: base, verse });
    });

    it('throws when verse missing', async () => {
      mockBookmarkRepo.findByUser.mockResolvedValue([base]);
      mockVerseRepo.findById.mockResolvedValue(null);
      await expect(service.getBookmarksWithVerses(userId)).rejects.toThrow(VerseNotFoundError);
    });
  });

  describe('organizeBookmarksBySurah', () => {
    it('organizes and sorts bookmarks', async () => {
      const bookmarks = [
        new Bookmark('b1', userId, 'v1', new BookmarkPosition(1, 3, new Date()), new Date()),
        new Bookmark('b2', userId, 'v2', new BookmarkPosition(1, 1, new Date()), new Date()),
        new Bookmark('b3', userId, 'v3', new BookmarkPosition(2, 5, new Date()), new Date()),
      ];
      mockBookmarkRepo.findByUser.mockResolvedValue(bookmarks);
      const result = await service.organizeBookmarksBySurah(userId);
      expect(result.get(1)?.map((b) => b.position.ayahNumber)).toEqual([1, 3]);
      expect(result.get(2)?.length).toBe(1);
    });
  });
});

