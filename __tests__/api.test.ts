import { getJuz, API_BASE_URL, getRandomVerse, searchVerses, getChapters } from '@/lib/api';
import { Juz, Verse, Chapter } from '@/types';

describe('getChapters', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches chapter data', async () => {
    const mockChapters: Chapter[] = [
      {
        id: 1,
        name_simple: 'Al-Fatihah',
        name_arabic: 'الفاتحة',
        revelation_place: 'makkah',
        verses_count: 7,
      },
    ];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ chapters: mockChapters }),
    }) as jest.Mock;

    const result = await getChapters();
    expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/chapters?language=en`);
    expect(result).toEqual(mockChapters);
  });

  it('throws on fetch error', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 }) as jest.Mock;
    await expect(getChapters()).rejects.toThrow('Failed to fetch chapters: 500');
  });
});

describe('getJuz', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches Juz data', async () => {
    const mockJuz: Juz = {
      id: 1,
      juz_number: 1,
      verse_mapping: { '1': '1-7' },
      first_verse_id: 1,
      last_verse_id: 148,
      verses_count: 148,
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ juz: mockJuz }),
    }) as jest.Mock;

    const result = await getJuz(1);
    expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/juzs/1`);
    expect(result).toEqual(mockJuz);
  });

  it('throws on fetch error', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 }) as jest.Mock;
    await expect(getJuz(1)).rejects.toThrow('Failed to fetch juz: 404');
  });
});

describe('getRandomVerse', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('normalizes random verse data', async () => {
    const mockRaw: Verse & { words: any[] } = {
      id: 1,
      verse_key: '1:1',
      text_uthmani: 'test',
      words: [
        { id: 1, text_uthmani: 'foo', translation: { text: 'bar' } },
        { id: 2, text: 'baz', translation: { text: 'qux' } },
      ],
    } as any;

    const expected: Verse = {
      id: 1,
      verse_key: '1:1',
      text_uthmani: 'test',
      words: [
        { id: 1, uthmani: 'foo', en: 'bar' },
        { id: 2, uthmani: 'baz', en: 'qux' },
      ],
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ verse: mockRaw }),
    }) as jest.Mock;

    const result = await getRandomVerse(20);
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/verses/random?translations=20&fields=text_uthmani`
    );
    expect(result).toEqual(expected);
  });

  it('throws on fetch error', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 }) as jest.Mock;
    await expect(getRandomVerse(20)).rejects.toThrow('Failed to fetch random verse: 500');
  });
});

describe('searchVerses', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('normalizes search results into Verse objects', async () => {
    const mockResult = {
      verse_id: 1,
      verse_key: '1:1',
      text: 'text',
      translations: [{ id: 1, resource_id: 20, text: 'tr' }],
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ search: { results: [mockResult] } }),
    }) as jest.Mock;

    const result = await searchVerses('foo');
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/search?q=foo&size=20&translations=20`
    );
    expect(result).toEqual([
      {
        id: 1,
        verse_key: '1:1',
        text_uthmani: 'text',
        translations: [{ id: 1, resource_id: 20, text: 'tr' }],
      },
    ]);
  });

  it('throws on fetch error', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 }) as jest.Mock;
    await expect(searchVerses('foo')).rejects.toThrow('Failed to search verses: 500');
  });
});
