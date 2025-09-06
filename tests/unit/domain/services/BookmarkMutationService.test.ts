import { Bookmark } from '../../../../src/domain/entities/Bookmark';
import { BookmarkMutationService } from '../../../../src/domain/services/BookmarkMutationService';
import { BookmarkPosition } from '../../../../src/domain/value-objects/BookmarkPosition';
import {
  BookmarkNotFoundError,
  UnauthorizedBookmarkError,
} from '../../../../src/domain/errors/DomainErrors';
import { IBookmarkRepository } from '../../../../src/domain/repositories/IBookmarkRepository';

// Mock repository
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

describe('BookmarkMutationService', () => {
  let mutationService: BookmarkMutationService;
  const userId = 'user123';
  const bookmarkId = 'bookmark123';
  const verseId = 'verse-1-1';
  const position = new BookmarkPosition(1, 1, new Date());

  beforeEach(() => {
    jest.clearAllMocks();
    mutationService = new BookmarkMutationService(mockBookmarkRepository);
  });

  describe('updateBookmarkNotes', () => {
    const newNotes = 'Updated notes';
    const baseBookmark = new Bookmark(
      bookmarkId,
      userId,
      verseId,
      position,
      new Date(),
      'Old notes'
    );

    it('should successfully update bookmark notes', async () => {
      mockBookmarkRepository.findById.mockResolvedValue(baseBookmark);
      mockBookmarkRepository.save.mockResolvedValue(undefined);

      const result = await mutationService.updateBookmarkNotes(userId, bookmarkId, newNotes);

      expect(result.notes).toBe(newNotes);
      expect(mockBookmarkRepository.save).toHaveBeenCalled();
    });

    it('should throw when bookmark not found', async () => {
      mockBookmarkRepository.findById.mockResolvedValue(null);

      await expect(
        mutationService.updateBookmarkNotes(userId, bookmarkId, newNotes)
      ).rejects.toThrow(BookmarkNotFoundError);
    });

    it("should throw when updating another user's bookmark", async () => {
      const otherBookmark = new Bookmark(bookmarkId, 'other', verseId, position, new Date(), 'Old');
      mockBookmarkRepository.findById.mockResolvedValue(otherBookmark);

      await expect(
        mutationService.updateBookmarkNotes(userId, bookmarkId, newNotes)
      ).rejects.toThrow(UnauthorizedBookmarkError);
    });
  });

  describe('updateBookmarkTags', () => {
    const newTags = ['important', 'memorize'];
    const baseBookmark = new Bookmark(bookmarkId, userId, verseId, position, new Date());

    it('should successfully update tags', async () => {
      mockBookmarkRepository.findById.mockResolvedValue(baseBookmark);
      mockBookmarkRepository.save.mockResolvedValue(undefined);

      const result = await mutationService.updateBookmarkTags(userId, bookmarkId, newTags);

      expect(result.tags).toEqual(newTags);
      expect(mockBookmarkRepository.save).toHaveBeenCalled();
    });

    it("should throw when updating another user's bookmark", async () => {
      const otherBookmark = new Bookmark(bookmarkId, 'other', verseId, position, new Date());
      mockBookmarkRepository.findById.mockResolvedValue(otherBookmark);

      await expect(mutationService.updateBookmarkTags(userId, bookmarkId, newTags)).rejects.toThrow(
        UnauthorizedBookmarkError
      );
    });
  });

  describe('addTagToBookmark', () => {
    const existingTags = ['memorize'];
    const newTag = 'important';
    const baseBookmark = new Bookmark(
      bookmarkId,
      userId,
      verseId,
      position,
      new Date(),
      undefined,
      existingTags
    );

    it('should add tag to bookmark', async () => {
      mockBookmarkRepository.findById.mockResolvedValue(baseBookmark);
      mockBookmarkRepository.save.mockResolvedValue(undefined);

      const result = await mutationService.addTagToBookmark(userId, bookmarkId, newTag);

      expect(result.tags).toContain(newTag);
      expect(mockBookmarkRepository.save).toHaveBeenCalled();
    });

    it("should throw when adding tag to another user's bookmark", async () => {
      const otherBookmark = new Bookmark(
        bookmarkId,
        'other',
        verseId,
        position,
        new Date(),
        undefined,
        existingTags
      );
      mockBookmarkRepository.findById.mockResolvedValue(otherBookmark);

      await expect(mutationService.addTagToBookmark(userId, bookmarkId, newTag)).rejects.toThrow(
        UnauthorizedBookmarkError
      );
    });
  });

  describe('removeTagFromBookmark', () => {
    const existingTags = ['important', 'memorize'];
    const tagToRemove = 'memorize';
    const baseBookmark = new Bookmark(
      bookmarkId,
      userId,
      verseId,
      position,
      new Date(),
      undefined,
      existingTags
    );

    it('should remove tag from bookmark', async () => {
      mockBookmarkRepository.findById.mockResolvedValue(baseBookmark);
      mockBookmarkRepository.save.mockResolvedValue(undefined);

      const result = await mutationService.removeTagFromBookmark(userId, bookmarkId, tagToRemove);

      expect(result.tags).not.toContain(tagToRemove);
      expect(mockBookmarkRepository.save).toHaveBeenCalled();
    });

    it("should throw when removing tag from another user's bookmark", async () => {
      const otherBookmark = new Bookmark(
        bookmarkId,
        'other',
        verseId,
        position,
        new Date(),
        undefined,
        existingTags
      );
      mockBookmarkRepository.findById.mockResolvedValue(otherBookmark);

      await expect(
        mutationService.removeTagFromBookmark(userId, bookmarkId, tagToRemove)
      ).rejects.toThrow(UnauthorizedBookmarkError);
    });
  });
});
