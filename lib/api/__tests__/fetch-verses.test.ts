import { API_BASE_URL } from '@/lib/api';
import { fetchVerses } from '@/lib/api/verses';

import type { RawVerse } from './apiMocks';

const mockVerse: RawVerse = {
  id: 1,
  verse_key: '1:1',
  text_uthmani: 'text',
  words: [{ id: 1, text: 'foo', translation: { text: 'bar' } }],
};

const mockFetchJson = (payload: unknown): void => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(payload),
  }) as jest.Mock;
};

const defaultArgs = {
  type: 'by_chapter' as const,
  id: 1,
  translationIds: 20,
  page: 1,
  perPage: 1,
  wordLang: 'en' as const,
};

describe('fetchVerses', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('constructs correct URL and normalizes verses', async () => {
    mockFetchJson({ pagination: { total_pages: 2 }, verses: [mockVerse] });

    const result = await fetchVerses(defaultArgs);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { Accept: 'application/json' },
        signal: expect.anything(),
      })
    );

    const [[calledUrl]] = (global.fetch as jest.Mock).mock.calls;
    const url = new URL(String(calledUrl));
    expect(`${url.origin}${url.pathname}`).toBe(`${API_BASE_URL}/verses/by_chapter/1`);

    expect(url.searchParams.get('language')).toBe('en');
    expect(url.searchParams.get('words')).toBe('true');
    expect(url.searchParams.get('word_translation_language')).toBe('en');
    expect(url.searchParams.get('word_fields')).toBe('text_uthmani,text_indopak');
    expect(url.searchParams.get('translations')).toBe('20');
    expect(url.searchParams.get('fields')).toBe('text_uthmani,text_indopak,audio');
    expect(url.searchParams.get('translation_fields')).toBe('resource_name');
    expect(url.searchParams.get('per_page')).toBe('1');
    expect(url.searchParams.get('page')).toBe('1');

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
    await expect(fetchVerses(defaultArgs)).rejects.toThrow('Failed to fetch verses: 500');
  });

  it('omits translation params when translationIds is empty', async () => {
    mockFetchJson({ pagination: { total_pages: 1 }, verses: [mockVerse] });

    await fetchVerses({ ...defaultArgs, translationIds: [] });

    const [[calledUrl]] = (global.fetch as jest.Mock).mock.calls;
    const url = new URL(String(calledUrl));
    expect(url.searchParams.get('translations')).toBeNull();
    expect(url.searchParams.get('translation_fields')).toBeNull();
  });
});
