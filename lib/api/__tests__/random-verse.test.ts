import { getRandomVerse } from '@/lib/api/verses';
import { Verse } from '@/types';

describe('getRandomVerse', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('normalizes random verse data (via internal API in browser)', async () => {
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
      json: () => Promise.resolve(mockRaw),
    }) as jest.Mock;

    const result = await getRandomVerse(20);
    expect(global.fetch).toHaveBeenCalledWith('/api/verses/random?translationId=20');
    expect(result).toEqual(expected);
  });

  it('falls back to local verse on client fetch error', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 }) as jest.Mock;
    const result = await getRandomVerse(20);
    expect(result).toMatchObject({ id: expect.any(Number), verse_key: expect.any(String) });
  });
});
