import { createRepository, mockApiVerse, mockApiVerses } from './test-utils';

describe('VerseRepository navigation', () => {
  let repository: ReturnType<typeof createRepository>;

  beforeEach(() => {
    repository = createRepository();
    jest.clearAllMocks();
  });

  it('should find next verse in same surah', async () => {
    mockApiVerses.getVerseById
      .mockResolvedValueOnce(mockApiVerse)
      .mockResolvedValueOnce({ ...mockApiVerse, verse_key: '1:2' });
    mockApiVerses.getVerseByKey.mockResolvedValue({ ...mockApiVerse, verse_key: '1:2' });

    const nextVerse = await repository.findNext('1:1');

    expect(nextVerse).toBeDefined();
    expect(nextVerse!.verseKey).toBe('1:2');
  });

  it('should find previous verse in same surah', async () => {
    mockApiVerses.getVerseById
      .mockResolvedValueOnce({ ...mockApiVerse, verse_key: '1:2' })
      .mockResolvedValueOnce(mockApiVerse);
    mockApiVerses.getVerseByKey.mockResolvedValue(mockApiVerse);

    const prevVerse = await repository.findPrevious('1:2');

    expect(prevVerse).toBeDefined();
    expect(prevVerse!.verseKey).toBe('1:1');
  });
});
