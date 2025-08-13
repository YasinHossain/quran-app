import { searchVerses } from '@/lib/api/verses';
import { API_BASE_URL } from '@/lib/api';

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
