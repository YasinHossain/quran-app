import { API_BASE_URL } from '@/lib/api';
import { getVersesByChapter, getVersesByJuz, getVersesByPage } from '@/lib/api/verses';
import { Verse } from '@/types';

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
      json: () => Promise.resolve({ pagination: { total_pages: 1 }, verses: [mockVerse] }),
    }) as jest.Mock;

    await getVersesByChapter({ id: 1, translationIds: 20, page: 1, perPage: 1, wordLang: 'tr' });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ headers: { Accept: 'application/json' } })
    );

    const [[calledUrl]] = (global.fetch as jest.Mock).mock.calls;
    const url = new URL(String(calledUrl));

    expect(`${url.origin}${url.pathname}`).toBe(`${API_BASE_URL}/verses/by_chapter/1`);
    expect(url.searchParams.get('language')).toBe('tr');
    expect(url.searchParams.get('translations')).toBe('20');
    expect(url.searchParams.get('word_translation_language')).toBe('tr');
    expect(url.searchParams.get('per_page')).toBe('1');
    expect(url.searchParams.get('page')).toBe('1');
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
      json: () => Promise.resolve({ pagination: { total_pages: 1 }, verses: [mockVerse] }),
    }) as jest.Mock;

    await getVersesByJuz({ id: 1, translationIds: 20, page: 1, perPage: 1, wordLang: 'en' });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ headers: { Accept: 'application/json' } })
    );

    const [[calledUrl]] = (global.fetch as jest.Mock).mock.calls;
    const url = new URL(String(calledUrl));

    expect(`${url.origin}${url.pathname}`).toBe(`${API_BASE_URL}/verses/by_juz/1`);
    expect(url.searchParams.get('language')).toBe('en');
    expect(url.searchParams.get('translations')).toBe('20');
    expect(url.searchParams.get('word_translation_language')).toBe('en');
    expect(url.searchParams.get('per_page')).toBe('1');
    expect(url.searchParams.get('page')).toBe('1');
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
      json: () => Promise.resolve({ pagination: { total_pages: 1 }, verses: [mockVerse] }),
    }) as jest.Mock;

    await getVersesByPage({ id: 1, translationIds: 20, page: 1, perPage: 1, wordLang: 'en' });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ headers: { Accept: 'application/json' } })
    );

    const [[calledUrl]] = (global.fetch as jest.Mock).mock.calls;
    const url = new URL(String(calledUrl));

    expect(`${url.origin}${url.pathname}`).toBe(`${API_BASE_URL}/verses/by_page/1`);
    expect(url.searchParams.get('language')).toBe('en');
    expect(url.searchParams.get('translations')).toBe('20');
    expect(url.searchParams.get('word_translation_language')).toBe('en');
    expect(url.searchParams.get('per_page')).toBe('1');
    expect(url.searchParams.get('page')).toBe('1');
  });
});
