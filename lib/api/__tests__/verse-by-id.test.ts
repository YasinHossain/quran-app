import { API_BASE_URL } from '@/lib/api';
import { getVerseById } from '@/lib/api/verses';
import { Verse } from '@/types';

import type { RawVerse } from './apiMocks';

describe('getVerseById', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('normalizes verse data', async () => {
    const mockRaw: RawVerse = {
      id: 1,
      verse_key: '1:1',
      text_uthmani: 'test',
      words: [
        { id: 1, text_uthmani: 'foo', translation: { text: 'bar' } },
        { id: 2, text: 'baz', translation: { text: 'qux' } },
      ],
    };

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

    const result = await getVerseById(1, [20, 22], 'en');
    const [fetchUrl, fetchInit] = (global.fetch as jest.Mock).mock.calls[0] as [string, unknown];
    const parsed = new URL(fetchUrl);
    expect(parsed.href.startsWith(`${API_BASE_URL}/verses/1?`)).toBe(true);
    expect(parsed.searchParams.get('translations')).toBe('20,22');
    expect(parsed.searchParams.get('fields')).toBe('text_uthmani,audio');
    expect(parsed.searchParams.get('words')).toBe('true');
    expect(parsed.searchParams.get('word_translation_language')).toBe('en');
    expect(parsed.searchParams.get('word_fields')).toBe('text_uthmani');
    expect(parsed.searchParams.get('translation_fields')).toBe('resource_name');
    expect(fetchInit).toEqual(expect.objectContaining({ headers: { Accept: 'application/json' } }));
    expect(result).toEqual(expected);
  });

  it('throws on fetch error', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 }) as jest.Mock;
    await expect(getVerseById(1, [20], 'en')).rejects.toThrow('Failed to fetch verse: 404');
  });
});
