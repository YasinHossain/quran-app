import { getVerseById } from '@/lib/api/verses';
import { API_BASE_URL } from '@/lib/api';
import { Verse } from '@/types';

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
