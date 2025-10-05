import { Bookmark } from '@/src/domain/entities';
import { UnauthorizedBookmarkError } from '@/src/domain/errors/DomainErrors';
import { BookmarkMutationService } from '@/src/domain/services/BookmarkMutationService';
import { BookmarkPosition } from '@/src/domain/value-objects/BookmarkPosition';

import { createMockBookmarkRepository, userId, verseId, bookmarkId } from './test-utils';

describe('BookmarkMutationService addTag', () => {
  let service: BookmarkMutationService;
  let mockRepo = createMockBookmarkRepository();
  const position = new BookmarkPosition(1, 1, new Date());

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepo = createMockBookmarkRepository();
    service = new BookmarkMutationService(mockRepo);
  });

  it('adds tag', async () => {
    const base = new Bookmark({
      id: bookmarkId,
      userId,
      verseId,
      position,
      createdAt: new Date(),
      tags: ['memorize'],
    });
    mockRepo.findById.mockResolvedValue(base);
    const result = await service.addTagToBookmark(userId, bookmarkId, 'important');
    expect(result.tags).toContain('important');
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it('throws on unauthorized', async () => {
    const other = new Bookmark({
      id: bookmarkId,
      userId: 'other',
      verseId,
      position,
      createdAt: new Date(),
      tags: ['memorize'],
    });
    mockRepo.findById.mockResolvedValue(other);
    await expect(service.addTagToBookmark(userId, bookmarkId, 'important')).rejects.toThrow(
      UnauthorizedBookmarkError
    );
  });
});
