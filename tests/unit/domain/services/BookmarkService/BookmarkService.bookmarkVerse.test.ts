import {
  createMockBookmarkRepository,
  createMockVerseRepository,
  userId,
  surahId,
  ayahNumber,
  verseId,
} from './test-utils';
import { Bookmark, Verse } from '@/src/domain/entities';
import {
  BookmarkAlreadyExistsError,
  VerseNotFoundError,
} from '../../../../../src/domain/errors/DomainErrors';
import { BookmarkService } from '@/src/domain/services/BookmarkService';

describe('BookmarkService bookmarkVerse', () => {
  let service: BookmarkService;
  let mockBookmarkRepo = createMockBookmarkRepository();
  let mockVerseRepo = createMockVerseRepository();
  const verse = new Verse({
    id: verseId,
    surahId,
    ayahNumber,
    arabicText: 'text',
    uthmaniText: 'uthmani',
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockBookmarkRepo = createMockBookmarkRepository();
    mockVerseRepo = createMockVerseRepository();
    service = new BookmarkService(mockBookmarkRepo, mockVerseRepo);
  });

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
