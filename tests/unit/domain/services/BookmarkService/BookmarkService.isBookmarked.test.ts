import {
  createMockBookmarkRepository,
  createMockVerseRepository,
  userId,
  surahId,
  ayahNumber,
} from './test-utils';
import { BookmarkService } from '@/src/domain/services/BookmarkService';

describe('BookmarkService isVerseBookmarked', () => {
  it('returns true then false based on repository', async () => {
    const mockBookmarkRepo = createMockBookmarkRepository();
    const mockVerseRepo = createMockVerseRepository();
    const service = new BookmarkService(mockBookmarkRepo, mockVerseRepo);
    mockBookmarkRepo.existsAtPosition.mockResolvedValueOnce(true);
    await expect(service.isVerseBookmarked(userId, surahId, ayahNumber)).resolves.toBe(true);
    mockBookmarkRepo.existsAtPosition.mockResolvedValueOnce(false);
    await expect(service.isVerseBookmarked(userId, surahId, ayahNumber)).resolves.toBe(false);
  });
});
