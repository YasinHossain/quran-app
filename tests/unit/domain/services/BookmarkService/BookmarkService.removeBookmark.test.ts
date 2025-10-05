import { Bookmark } from '@/src/domain/entities';
import { BookmarkNotFoundError, UnauthorizedBookmarkError } from '@/src/domain/errors/DomainErrors';
import { BookmarkService } from '@/src/domain/services/BookmarkService';
import { BookmarkPosition } from '@/src/domain/value-objects/BookmarkPosition';

import {
  createMockBookmarkRepository,
  createMockVerseRepository,
  userId,
  surahId,
  ayahNumber,
  verseId,
  bookmarkId,
} from './test-utils';

describe('BookmarkService removeBookmark', () => {
  let service: BookmarkService;
  let mockBookmarkRepo = createMockBookmarkRepository();
  let mockVerseRepo = createMockVerseRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    mockBookmarkRepo = createMockBookmarkRepository();
    mockVerseRepo = createMockVerseRepository();
    service = new BookmarkService(mockBookmarkRepo, mockVerseRepo);
  });

  it('removes bookmark', async () => {
    const base = new Bookmark({
      id: bookmarkId,
      userId,
      verseId,
      position: new BookmarkPosition(surahId, ayahNumber, new Date()),
      createdAt: new Date(),
    });
    mockBookmarkRepo.findById.mockResolvedValue(base);
    await service.removeBookmark(userId, bookmarkId);
    expect(mockBookmarkRepo.remove).toHaveBeenCalledWith(bookmarkId);
  });

  it('throws when missing', async () => {
    mockBookmarkRepo.findById.mockResolvedValue(null);
    await expect(service.removeBookmark(userId, bookmarkId)).rejects.toThrow(BookmarkNotFoundError);
  });

  it('throws on unauthorized removal', async () => {
    const other = new Bookmark({
      id: bookmarkId,
      userId: 'other',
      verseId,
      position: new BookmarkPosition(surahId, ayahNumber, new Date()),
      createdAt: new Date(),
    });
    mockBookmarkRepo.findById.mockResolvedValue(other);
    await expect(service.removeBookmark(userId, bookmarkId)).rejects.toThrow(
      UnauthorizedBookmarkError
    );
  });
});
