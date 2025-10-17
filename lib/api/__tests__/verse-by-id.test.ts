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
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/verses/1?translations=20,22&fields=text_uthmani,audio&words=true&word_translation_language=en&word_fields=text_uthmani`,
      expect.objectContaining({ headers: { Accept: 'application/json' } })
    );
    expect(result).toEqual(expected);
  });

  it('throws on fetch error', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 }) as jest.Mock;
    await expect(getVerseById(1, [20], 'en')).rejects.toThrow('Failed to fetch verse: 404');
  });
});
