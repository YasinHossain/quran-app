import { Bookmark, Verse } from '@/src/domain/entities';
import { VerseNotFoundError } from '@/src/domain/errors/DomainErrors';
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

describe('BookmarkService queries', () => {
  let service: BookmarkService;
  let mockBookmarkRepo = createMockBookmarkRepository();
  let mockVerseRepo = createMockVerseRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    mockBookmarkRepo = createMockBookmarkRepository();
    mockVerseRepo = createMockVerseRepository();
    service = new BookmarkService(mockBookmarkRepo, mockVerseRepo);
  });

  // moved to dedicated test file

  it('getBookmarksWithVerses returns bookmarks with verses', async () => {
    const base = new Bookmark({
      id: bookmarkId,
      userId,
      verseId,
      position: new BookmarkPosition(surahId, ayahNumber, new Date()),
      createdAt: new Date(),
    });
    const verse = new Verse({
      id: verseId,
      surahId,
      ayahNumber,
      arabicText: 'text',
      uthmaniText: 'uthmani',
    });
    mockBookmarkRepo.findByUser.mockResolvedValue([base]);
    mockVerseRepo.findById.mockResolvedValue(verse);
    const result = await service.getBookmarksWithVerses(userId);
    expect(result[0]).toEqual({ bookmark: base, verse });
  });

  it('getBookmarksWithVerses throws when verse missing', async () => {
    const base = new Bookmark({
      id: bookmarkId,
      userId,
      verseId,
      position: new BookmarkPosition(surahId, ayahNumber, new Date()),
      createdAt: new Date(),
    });
    mockBookmarkRepo.findByUser.mockResolvedValue([base]);
    mockVerseRepo.findById.mockResolvedValue(null);
    await expect(service.getBookmarksWithVerses(userId)).rejects.toThrow(VerseNotFoundError);
  });

  it('organizeBookmarksBySurah organizes and sorts', async () => {
    const bookmarks = [
      new Bookmark({
        id: 'b1',
        userId,
        verseId: 'v1',
        position: new BookmarkPosition(1, 3, new Date()),
        createdAt: new Date(),
      }),
      new Bookmark({
        id: 'b2',
        userId,
        verseId: 'v2',
        position: new BookmarkPosition(1, 1, new Date()),
        createdAt: new Date(),
      }),
      new Bookmark({
        id: 'b3',
        userId,
        verseId: 'v3',
        position: new BookmarkPosition(2, 5, new Date()),
        createdAt: new Date(),
      }),
    ];
    mockBookmarkRepo.findByUser.mockResolvedValue(bookmarks);
    const result = await service.organizeBookmarksBySurah(userId);
    expect(result.get(1)?.map((b) => b.position.ayahNumber)).toEqual([1, 3]);
    expect(result.get(2)?.length).toBe(1);
  });
});
