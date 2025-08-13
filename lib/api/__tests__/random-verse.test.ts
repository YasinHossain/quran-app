import { getRandomVerse } from '@/lib/api/verses';
import { API_BASE_URL } from '@/lib/api';
import { Verse } from '@/types';

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
