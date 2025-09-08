import { createMockBookmarkRepository, userId, verseId, bookmarkId } from './test-utils';
import { Bookmark } from '@/src/domain/entities';
import {
  BookmarkNotFoundError,
  UnauthorizedBookmarkError,
} from '../../../../../src/domain/errors/DomainErrors';
import { BookmarkMutationService } from '@/src/domain/services/BookmarkMutationService';
import { BookmarkPosition } from '@/src/domain/value-objects/BookmarkPosition';

describe('BookmarkMutationService updateNotes', () => {
  let service: BookmarkMutationService;
  let mockRepo = createMockBookmarkRepository();
  const position = new BookmarkPosition(1, 1, new Date());

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepo = createMockBookmarkRepository();
    service = new BookmarkMutationService(mockRepo);
  });

  it('updates notes', async () => {
    const base = new Bookmark(bookmarkId, userId, verseId, position, new Date(), 'Old notes');
    mockRepo.findById.mockResolvedValue(base);
    const result = await service.updateBookmarkNotes(userId, bookmarkId, 'Updated notes');
    expect(result.notes).toBe('Updated notes');
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it('throws when not found', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.updateBookmarkNotes(userId, bookmarkId, 'Updated notes')).rejects.toThrow(
      BookmarkNotFoundError
    );
  });

  it('throws on unauthorized', async () => {
    const other = new Bookmark(bookmarkId, 'other', verseId, position, new Date(), 'Old notes');
    mockRepo.findById.mockResolvedValue(other);
    await expect(service.updateBookmarkNotes(userId, bookmarkId, 'Updated notes')).rejects.toThrow(
      UnauthorizedBookmarkError
    );
  });
});
