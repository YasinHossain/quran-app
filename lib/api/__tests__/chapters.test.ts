import { getChapters, getSurahCoverUrl } from '@/lib/api/chapters';
import { API_BASE_URL } from '@/lib/api';
import { Chapter } from '@/types';

jest.mock('@/app/(features)/surah/lib/surahImageMap', () => ({
  surahImageMap: { 1: 'test.jpg' },
}));

describe('getChapters', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches chapter data', async () => {
    const mockChapters: Chapter[] = [
      {
        id: 1,
        name_simple: 'Al-Fatihah',
        name_arabic: 'الفاتحة',
        revelation_place: 'makkah',
        verses_count: 7,
      },
    ];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ chapters: mockChapters }),
    }) as jest.Mock;

    const result = await getChapters();
    expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/chapters?language=en`);
    expect(result).toEqual(mockChapters);
  });

  it('throws on fetch error', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 }) as jest.Mock;
    await expect(getChapters()).rejects.toThrow('Failed to fetch chapters: 500');
  });
});

describe('getSurahCoverUrl', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns preferred URL when available', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ preferred: { url: 'http://img.test' } }),
    }) as jest.Mock;

    const result = await getSurahCoverUrl(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.wikimedia.org/core/v1/commons/file/File:test.jpg'
    );
    expect(result).toBe('http://img.test');
  });

  it('returns null when no mapping', async () => {
    const result = await getSurahCoverUrl(2);
    expect(result).toBeNull();
  });
});
