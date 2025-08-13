import {
  fetchVerses,
  getVersesByChapter,
  getVersesByJuz,
  getVersesByPage,
  getJuz,
  getRandomVerse,
  getVerseById,
  searchVerses,
} from '@/lib/api/verses';
import { API_BASE_URL } from '@/lib/api';
import { Verse, Juz } from '@/types';

describe('fetchVerses', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('constructs correct URL and normalizes verses', async () => {
    const mockVerse: any = {
      id: 1,
      verse_key: '1:1',
      text_uthmani: 'text',
      words: [{ id: 1, text: 'foo', translation: { text: 'bar' } }],
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ meta: { total_pages: 2 }, verses: [mockVerse] }),
    }) as jest.Mock;

    const result = await fetchVerses('by_chapter', 1, 20, 1, 1, 'en');
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/verses/by_chapter/1?language=en&words=true&word_translation_language=en&word_fields=text_uthmani&translations=20&fields=text_uthmani,audio&per_page=1&page=1`
    );
    expect(result).toEqual({
      totalPages: 2,
      verses: [
        {
          id: 1,
          verse_key: '1:1',
          text_uthmani: 'text',
          words: [{ id: 1, uthmani: 'foo', en: 'bar' }],
        },
      ],
    });
  });

  it('throws an error when the response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 }) as jest.Mock;
    await expect(fetchVerses('by_chapter', 1, 20, 1, 1, 'en')).rejects.toThrow(
      'Failed to fetch verses: 500'
    );
  });
});

describe('getVersesByChapter', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('delegates to fetchVerses with chapter endpoint', async () => {
    const mockVerse: Verse = {
      id: 1,
      verse_key: '1:1',
      text_uthmani: 'text',
      words: [],
    } as Verse;

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ meta: { total_pages: 1 }, verses: [mockVerse] }),
    }) as jest.Mock;

    await getVersesByChapter(1, 20, 1, 1, 'tr');
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/verses/by_chapter/1?language=tr&words=true&word_translation_language=tr&word_fields=text_uthmani&translations=20&fields=text_uthmani,audio&per_page=1&page=1`
    );
  });
});

describe('getVersesByJuz', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('delegates to fetchVerses with juz endpoint', async () => {
    const mockVerse: Verse = {
      id: 1,
      verse_key: '1:1',
      text_uthmani: 'text',
      words: [],
    } as Verse;

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ meta: { total_pages: 1 }, verses: [mockVerse] }),
    }) as jest.Mock;

    await getVersesByJuz(1, 20, 1, 1, 'en');
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/verses/by_juz/1?language=en&words=true&word_translation_language=en&word_fields=text_uthmani&translations=20&fields=text_uthmani,audio&per_page=1&page=1`
    );
  });
});

describe('getVersesByPage', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('delegates to fetchVerses with page endpoint', async () => {
    const mockVerse: Verse = {
      id: 1,
      verse_key: '1:1',
      text_uthmani: 'text',
      words: [],
    } as Verse;

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ meta: { total_pages: 1 }, verses: [mockVerse] }),
    }) as jest.Mock;

    await getVersesByPage(1, 20, 1, 1, 'en');
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/verses/by_page/1?language=en&words=true&word_translation_language=en&word_fields=text_uthmani&translations=20&fields=text_uthmani,audio&per_page=1&page=1`
    );
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

describe('getVerseById', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('normalizes verse data', async () => {
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

    const result = await getVerseById(1, 20);
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/verses/1?translations=20&fields=text_uthmani`
    );
    expect(result).toEqual(expected);
  });

  it('throws on fetch error', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 }) as jest.Mock;
    await expect(getVerseById(1, 20)).rejects.toThrow('Failed to fetch verse: 404');
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
