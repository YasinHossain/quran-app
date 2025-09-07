import { createMockBookmarkRepository, userId, verseId, bookmarkId } from './test-utils';
import { Bookmark } from '../../../../../src/domain/entities';
import {
  BookmarkNotFoundError,
  UnauthorizedBookmarkError,
} from '../../../../../src/domain/errors/DomainErrors';
import { BookmarkMutationService } from '../../../../../src/domain/services/BookmarkMutationService';
import { BookmarkPosition } from '../../../../../src/domain/value-objects/BookmarkPosition';

describe('BookmarkService mutations', () => {
  let mutationService: BookmarkMutationService;
  let mockBookmarkRepository = createMockBookmarkRepository();
  const position = new BookmarkPosition(1, 1, new Date());

  beforeEach(() => {
    jest.clearAllMocks();
    mockBookmarkRepository = createMockBookmarkRepository();
    mutationService = new BookmarkMutationService(mockBookmarkRepository);
  });

  describe('updateBookmarkNotes', () => {
    const baseBookmark = new Bookmark(
      bookmarkId,
      userId,
      verseId,
      position,
      new Date(),
      'Old notes'
    );

    it('updates notes', async () => {
      mockBookmarkRepository.findById.mockResolvedValue(baseBookmark);
      const result = await mutationService.updateBookmarkNotes(userId, bookmarkId, 'Updated notes');
      expect(result.notes).toBe('Updated notes');
      expect(mockBookmarkRepository.save).toHaveBeenCalled();
    });

    it('throws when not found', async () => {
      mockBookmarkRepository.findById.mockResolvedValue(null);
      await expect(
        mutationService.updateBookmarkNotes(userId, bookmarkId, 'Updated notes')
      ).rejects.toThrow(BookmarkNotFoundError);
    });

    it('throws on unauthorized', async () => {
      const other = new Bookmark(bookmarkId, 'other', verseId, position, new Date(), 'Old notes');
      mockBookmarkRepository.findById.mockResolvedValue(other);
      await expect(
        mutationService.updateBookmarkNotes(userId, bookmarkId, 'Updated notes')
      ).rejects.toThrow(UnauthorizedBookmarkError);
    });
  });

  describe('updateBookmarkTags', () => {
    const baseBookmark = new Bookmark(bookmarkId, userId, verseId, position, new Date());

    it('updates tags', async () => {
      mockBookmarkRepository.findById.mockResolvedValue(baseBookmark);
      const result = await mutationService.updateBookmarkTags(userId, bookmarkId, ['important']);
      expect(result.tags).toEqual(['important']);
      expect(mockBookmarkRepository.save).toHaveBeenCalled();
    });

    it('throws on unauthorized', async () => {
      const other = new Bookmark(bookmarkId, 'other', verseId, position, new Date());
      mockBookmarkRepository.findById.mockResolvedValue(other);
      await expect(
        mutationService.updateBookmarkTags(userId, bookmarkId, ['important'])
      ).rejects.toThrow(UnauthorizedBookmarkError);
    });
  });

  describe('addTagToBookmark', () => {
    const baseBookmark = new Bookmark(
      bookmarkId,
      userId,
      verseId,
      position,
      new Date(),
      undefined,
      ['memorize']
    );

    it('adds tag', async () => {
      mockBookmarkRepository.findById.mockResolvedValue(baseBookmark);
      const result = await mutationService.addTagToBookmark(userId, bookmarkId, 'important');
      expect(result.tags).toContain('important');
      expect(mockBookmarkRepository.save).toHaveBeenCalled();
    });

    it('throws on unauthorized', async () => {
      const other = new Bookmark(bookmarkId, 'other', verseId, position, new Date(), undefined, [
        'memorize',
      ]);
      mockBookmarkRepository.findById.mockResolvedValue(other);
      await expect(
        mutationService.addTagToBookmark(userId, bookmarkId, 'important')
      ).rejects.toThrow(UnauthorizedBookmarkError);
    });
  });

  describe('removeTagFromBookmark', () => {
    const baseBookmark = new Bookmark(
      bookmarkId,
      userId,
      verseId,
      position,
      new Date(),
      undefined,
      ['important', 'memorize']
    );

    it('removes tag', async () => {
      mockBookmarkRepository.findById.mockResolvedValue(baseBookmark);
      const result = await mutationService.removeTagFromBookmark(userId, bookmarkId, 'memorize');
      expect(result.tags).not.toContain('memorize');
      expect(mockBookmarkRepository.save).toHaveBeenCalled();
    });

    it('throws on unauthorized', async () => {
      const other = new Bookmark(bookmarkId, 'other', verseId, position, new Date(), undefined, [
        'important',
        'memorize',
      ]);
      mockBookmarkRepository.findById.mockResolvedValue(other);
      await expect(
        mutationService.removeTagFromBookmark(userId, bookmarkId, 'memorize')
      ).rejects.toThrow(UnauthorizedBookmarkError);
    });
  });
});
