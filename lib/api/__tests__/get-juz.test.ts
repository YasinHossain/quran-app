import { API_BASE_URL } from '@/lib/api';
import { getJuz } from '@/lib/api/verses';
import { Juz } from '@/types';

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
