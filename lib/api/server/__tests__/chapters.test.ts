import { getChaptersServer } from '@/lib/api/server/chapters';

jest.mock('next/cache', () => ({
  unstable_cache: (fn: unknown) => fn,
}));

jest.mock('@/src/infrastructure/monitoring/Logger', () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('getChaptersServer', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    (global as { fetch?: typeof fetch }).fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    fetchMock.mockReset();
  });

  it('falls back to the Quran.com chapters endpoint when the primary source fails', async () => {
    const chapter = {
      id: 1,
      name_simple: 'Al-Fatihah',
      name_arabic: 'الفاتحة',
      verses_count: 7,
      translated_name: { name: 'The Opening' },
    };

    fetchMock
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ chapters: [chapter] }),
      });

    const result = await getChaptersServer();

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://api.qurancdn.com/api/qdc/chapters?language=en',
      expect.objectContaining({
        headers: { Accept: 'application/json' },
      })
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://api.quran.com/api/v4/chapters?language=en',
      expect.objectContaining({
        headers: { Accept: 'application/json' },
      })
    );
    expect(result).toEqual([chapter]);
  });
});
