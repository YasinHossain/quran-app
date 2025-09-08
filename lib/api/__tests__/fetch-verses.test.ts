import { API_BASE_URL } from '@/lib/api';
import { fetchVerses } from '@/lib/api/verses';

import type { RawVerse } from './apiMocks';

describe('fetchVerses', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('constructs correct URL and normalizes verses', async () => {
    const mockVerse: RawVerse = {
      id: 1,
      verse_key: '1:1',
      text_uthmani: 'text',
      words: [{ id: 1, text: 'foo', translation: { text: 'bar' } }],
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ pagination: { total_pages: 2 }, verses: [mockVerse] }),
    }) as jest.Mock;

    const result = await fetchVerses({
      type: 'by_chapter',
      id: 1,
      translationIds: 20,
      page: 1,
      perPage: 1,
      wordLang: 'en',
    });
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
    await expect(
      fetchVerses({
        type: 'by_chapter',
        id: 1,
        translationIds: 20,
        page: 1,
        perPage: 1,
        wordLang: 'en',
      })
    ).rejects.toThrow('Failed to fetch verses: 500');
  });
});
