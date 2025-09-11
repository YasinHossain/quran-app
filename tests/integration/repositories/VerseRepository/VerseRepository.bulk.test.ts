import { createRepository, mockApiVerse, mockApiVerses } from './test-utils';

let repository: ReturnType<typeof createRepository>;

beforeEach(() => {
  repository = createRepository();
  jest.clearAllMocks();
});

describe('VerseRepository bulk retrieval - findBySurah', () => {
  it('should find all verses in a surah', async () => {
    const surahVerses = [
      mockApiVerse,
      { ...mockApiVerse, id: 2, verse_key: '1:2' },
      { ...mockApiVerse, id: 3, verse_key: '1:3' },
    ];

    mockApiVerses.getVersesByChapter.mockResolvedValue({
      verses: surahVerses,
      totalPages: 1,
    });

    const verses = await repository.findBySurah(1);

    expect(verses).toHaveLength(3);
    expect(verses[0].ayahNumber).toBe(1);
    expect(verses[1].ayahNumber).toBe(2);
    expect(mockApiVerses.getVersesByChapter).toHaveBeenCalledWith({
      id: 1,
      translationIds: 20,
      page: 1,
      perPage: 300,
    });
  });

  it('should return empty array on error', async () => {
    mockApiVerses.getVersesByChapter.mockRejectedValue(new Error('API error'));

    const verses = await repository.findBySurah(1);

    expect(verses).toHaveLength(0);
  });
});

describe('VerseRepository bulk retrieval - findByJuz', () => {
  it('should find verses by Juz number', async () => {
    mockApiVerses.getVersesByJuz.mockResolvedValue({
      verses: [mockApiVerse],
      totalPages: 1,
    });

    const verses = await repository.findByJuz(1);

    expect(verses).toHaveLength(1);
    expect(verses[0].id).toBe('1:1');
    expect(mockApiVerses.getVersesByJuz).toHaveBeenCalledWith({
      id: 1,
      translationIds: 20,
      page: 1,
      perPage: 500,
    });
  });
});

describe('VerseRepository bulk retrieval - findByPage', () => {
  it('should find verses by page number', async () => {
    mockApiVerses.getVersesByPage.mockResolvedValue({
      verses: [mockApiVerse],
      totalPages: 1,
    });

    const verses = await repository.findByPage(1);

    expect(verses).toHaveLength(1);
    expect(verses[0].id).toBe('1:1');
    expect(mockApiVerses.getVersesByPage).toHaveBeenCalledWith({
      id: 1,
      translationIds: 20,
      page: 1,
      perPage: 50,
    });
  });
});

describe('VerseRepository bulk retrieval - search', () => {
  it('should search verses by query', async () => {
    mockApiVerses.searchVerses.mockResolvedValue([mockApiVerse]);

    const verses = await repository.search('Allah');

    expect(verses).toHaveLength(1);
    expect(verses[0].id).toBe('1:1');
    expect(mockApiVerses.searchVerses).toHaveBeenCalledWith('Allah');
  });

  it('should return empty array on search error', async () => {
    mockApiVerses.searchVerses.mockRejectedValue(new Error('Search failed'));

    const verses = await repository.search('test');

    expect(verses).toHaveLength(0);
  });
});

describe('VerseRepository bulk retrieval - findRandom', () => {
  it('should find a random verse', async () => {
    mockApiVerses.getRandomVerse.mockResolvedValue(mockApiVerse);

    const verses = await repository.findRandom(1);

    expect(verses).toHaveLength(1);
    expect(verses[0].id).toBe('1:1');
    expect(mockApiVerses.getRandomVerse).toHaveBeenCalledWith(20);
  });

  it('should return empty array if random verse fails', async () => {
    mockApiVerses.getRandomVerse.mockRejectedValue(new Error('Failed'));

    const verses = await repository.findRandom(1);

    expect(verses).toHaveLength(0);
  });
});

describe('VerseRepository bulk retrieval - findByVerseKeys', () => {
  it('should find verses by verse keys', async () => {
    mockApiVerses.getVerseByKey
      .mockResolvedValueOnce(mockApiVerse)
      .mockResolvedValueOnce({ ...mockApiVerse, verse_key: '2:255' });

    const verses = await repository.findByVerseKeys(['1:1', '2:255']);

    expect(verses).toHaveLength(2);
    expect(verses[0].verseKey).toBe('1:1');
    expect(verses[1].verseKey).toBe('2:255');
  });
});
