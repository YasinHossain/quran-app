import { API_BASE_URL, getTafsirByVerse, getTafsirResources, TafsirResource } from '@/lib/api';

describe('getTafsirResources', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('parses tafsir resources', async () => {
    const mockResource: TafsirResource = {
      id: 1,
      slug: 'test',
      name: 'Test Tafsir',
      language_name: 'English',
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ tafsirs: [mockResource] }),
    }) as jest.Mock;

    const result = await getTafsirResources();
    expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/resources/tafsirs`);
    expect(result).toEqual([mockResource]);
  });

  it('throws on fetch error', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 }) as jest.Mock;
    await expect(getTafsirResources()).rejects.toThrow('Failed to fetch tafsir resources: 500');
  });
});

describe('getTafsirByVerse', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('encodes verse key and returns text', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ tafsir: { text: 'foo' } }),
    }) as jest.Mock;

    const result = await getTafsirByVerse('1:1');
    expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/tafsirs/169/by_ayah/1%3A1`);
    expect(result).toBe('foo');
  });

  it('throws on fetch error', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 }) as jest.Mock;
    await expect(getTafsirByVerse('1:1')).rejects.toThrow('Failed to fetch tafsir: 404');
  });
});
