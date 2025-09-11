import { Verse as VerseEntity } from '@/src/domain/entities/Verse';
import { logger, MemoryTransport, LogLevel } from '@/src/infrastructure/monitoring';
import { Chapter } from '@/types';

import { createRepository, mockApiVerse, mockApiVerses, mockApiChapters } from './test-utils';

describe('VerseRepository findById', () => {
  let repository: ReturnType<typeof createRepository>;

  beforeEach(() => {
    repository = createRepository();
    jest.clearAllMocks();
  });

  it('should find verse by ID successfully', async () => {
    mockApiVerses.getVerseById.mockResolvedValue(mockApiVerse);

    const verse = await repository.findById('1:1');

    expect(verse).toBeDefined();
    expect(verse!.id).toBe('1:1');
    expect(verse!.surahId).toBe(1);
    expect(verse!.ayahNumber).toBe(1);
    expect(mockApiVerses.getVerseById).toHaveBeenCalledWith('1:1', 20);
  });

  it('should return null for non-existent verse', async () => {
    mockApiVerses.getVerseById.mockRejectedValue(new Error('Not found'));

    const verse = await repository.findById('999:999');
    expect(verse).toBeNull();
  });
});

describe('VerseRepository findBySurahAndAyah', () => {
  let repository: ReturnType<typeof createRepository>;

  beforeEach(() => {
    repository = createRepository();
    jest.clearAllMocks();
  });

  it('should find verse by surah and ayah', async () => {
    mockApiVerses.getVerseByKey.mockResolvedValue(mockApiVerse);

    const verse = await repository.findBySurahAndAyah(1, 1);

    expect(verse).toBeDefined();
    expect(verse!.surahId).toBe(1);
    expect(verse!.ayahNumber).toBe(1);
    expect(mockApiVerses.getVerseByKey).toHaveBeenCalledWith('1:1', 20);
  });

  it('should return null if verse not found', async () => {
    mockApiVerses.getVerseByKey.mockRejectedValue(new Error('Not found'));

    const verse = await repository.findBySurahAndAyah(999, 999);
    expect(verse).toBeNull();
  });
});

describe('VerseRepository getTotalCount', () => {
  let repository: ReturnType<typeof createRepository>;

  beforeEach(() => {
    repository = createRepository();
    jest.clearAllMocks();
  });

  it('should return total verse count', async () => {
    const count = await repository.getTotalCount();
    expect(count).toBe(6236);
  });
});

describe('VerseRepository exists', () => {
  let repository: ReturnType<typeof createRepository>;

  beforeEach(() => {
    repository = createRepository();
    jest.clearAllMocks();
  });

  it('should return true if verse exists', async () => {
    mockApiVerses.getVerseById.mockResolvedValue(mockApiVerse);

    const exists = await repository.exists('1:1');
    expect(exists).toBe(true);
  });

  it('should return false if verse does not exist', async () => {
    mockApiVerses.getVerseById.mockRejectedValue(new Error('Not found'));

    const exists = await repository.exists('999:999');
    expect(exists).toBe(false);
  });
});

describe('VerseRepository unsupported operations', () => {
  let repository: ReturnType<typeof createRepository>;

  beforeEach(() => {
    repository = createRepository();
    jest.clearAllMocks();
  });

  it('should throw error for save operation', async () => {
    const mockVerse = new VerseEntity({
      id: '1:1',
      surahId: 1,
      ayahNumber: 1,
      arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      uthmaniText: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'
    });

    await expect(repository.save(mockVerse)).rejects.toThrow(
      'Save operation not supported by read-only API'
    );
  });

  it('should throw error for remove operation', async () => {
    await expect(repository.remove('1:1')).rejects.toThrow(
      'Remove operation not supported by read-only API'
    );
  });
});

describe('VerseRepository findSajdahVerses', () => {
  let repository: ReturnType<typeof createRepository>;

  beforeEach(() => {
    repository = createRepository();
    jest.clearAllMocks();
  });

  it('should find sajdah verses', async () => {
    mockApiVerses.getVerseByKey
      .mockResolvedValueOnce({ ...mockApiVerse, verse_key: '7:206' })
      .mockResolvedValueOnce({ ...mockApiVerse, verse_key: '13:15' })
      .mockResolvedValueOnce({ ...mockApiVerse, verse_key: '16:50' });

    const sajdahVerses = await repository.findSajdahVerses();
    expect(sajdahVerses.length).toBeGreaterThanOrEqual(3);
  });
});

describe('VerseRepository findByRevelationType', () => {
  let repository: ReturnType<typeof createRepository>;

  beforeEach(() => {
    repository = createRepository();
    jest.clearAllMocks();
  });

  it('should find verses from Makki surahs', async () => {
    mockApiChapters.getChapters.mockResolvedValue([
      {
        id: 1,
        name_simple: 'Al-Fatihah',
        name_arabic: '',
        revelation_place: 'makkah',
        verses_count: 7,
      },
      {
        id: 2,
        name_simple: 'Al-Baqarah',
        name_arabic: '',
        revelation_place: 'madinah',
        verses_count: 286,
      },
    ] as Chapter[]);
    mockApiVerses.getVersesByChapter.mockResolvedValue({ verses: [mockApiVerse], totalPages: 1 });

    const verses = await repository.findByRevelationType('makki');

    expect(verses).toHaveLength(1);
    expect(mockApiVerses.getVersesByChapter).toHaveBeenCalledWith({
      id: 1,
      translationIds: 20,
      page: 1,
      perPage: 300,
    });
  });
});

describe('VerseRepository offline caching', () => {
  let repository: ReturnType<typeof createRepository>;

  beforeEach(() => {
    repository = createRepository();
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should cache verses for offline use', async () => {
    mockApiVerses.getVersesByChapter.mockResolvedValue({ verses: [mockApiVerse], totalPages: 1 });

    await repository.cacheForOffline([1]);

    const cached = localStorage.getItem('verse-cache-1');
    expect(cached).not.toBeNull();
    const parsed = JSON.parse(cached!);
    expect(parsed).toHaveLength(1);
  });

  it('should clear cached verses', async () => {
    mockApiVerses.getVersesByChapter.mockResolvedValue({ verses: [mockApiVerse], totalPages: 1 });

    await repository.cacheForOffline([1]);
    await repository.clearCache();

    expect(localStorage.getItem('verse-cache-1')).toBeNull();
  });
});

describe('VerseRepository logging', () => {
  let repository: ReturnType<typeof createRepository>;
  let memory: MemoryTransport;

  beforeEach(() => {
    repository = createRepository();
    jest.clearAllMocks();
    memory = new MemoryTransport();
    logger.addTransport(memory);
  });

  afterEach(() => {
    logger.removeTransport(memory);
    memory.clear();
  });

  it('logs warning for unsupported save operation', async () => {
    const verse = new VerseEntity('1:1', 1, 1, '', '');

    await expect(repository.save(verse)).rejects.toThrow(
      'Save operation not supported by read-only API'
    );

    const entries = memory.getEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].level).toBe(LogLevel.WARN);
    expect(entries[0].message).toBe('Save operation not supported by read-only API');
  });
});
