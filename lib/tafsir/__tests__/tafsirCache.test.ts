import { getTafsirByVerse } from '@/lib/api';
import { CACHE_TTL, MAX_CACHE_SIZE, clearTafsirCache, getTafsirCached } from '../tafsirCache';

jest.mock('@/lib/api', () => ({
  getTafsirByVerse: jest.fn(),
}));

describe('getTafsirCached', () => {
  beforeEach(() => {
    clearTafsirCache();
    (getTafsirByVerse as jest.Mock).mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
    clearTafsirCache();
  });

  it('returns cached value on repeated calls', async () => {
    (getTafsirByVerse as jest.Mock).mockResolvedValue('tafsir');
    const first = await getTafsirCached('1:1', 169);
    const second = await getTafsirCached('1:1', 169);
    expect(first).toBe('tafsir');
    expect(second).toBe('tafsir');
    expect(getTafsirByVerse).toHaveBeenCalledTimes(1);
  });

  it('expires cache entries based on TTL', async () => {
    jest.useFakeTimers();
    (getTafsirByVerse as jest.Mock).mockResolvedValue('tafsir1');
    jest.setSystemTime(0);
    await getTafsirCached('1:1');
    jest.setSystemTime(CACHE_TTL + 1);
    (getTafsirByVerse as jest.Mock).mockResolvedValue('tafsir2');
    const result = await getTafsirCached('1:1');
    expect(result).toBe('tafsir2');
    expect(getTafsirByVerse).toHaveBeenCalledTimes(2);
  });

  it('evicts oldest entry when cache limit exceeded', async () => {
    jest.useFakeTimers();
    (getTafsirByVerse as jest.Mock).mockImplementation((verseKey: string) =>
      Promise.resolve(`tafsir-${verseKey}`)
    );
    for (let i = 0; i < MAX_CACHE_SIZE; i++) {
      jest.setSystemTime(i);
      await getTafsirCached(`${i}:1`);
    }
    expect(getTafsirByVerse).toHaveBeenCalledTimes(MAX_CACHE_SIZE);
    jest.setSystemTime(MAX_CACHE_SIZE);
    await getTafsirCached(`${MAX_CACHE_SIZE}:1`);
    expect(getTafsirByVerse).toHaveBeenCalledTimes(MAX_CACHE_SIZE + 1);
    jest.setSystemTime(MAX_CACHE_SIZE + 1);
    await getTafsirCached('0:1');
    expect(getTafsirByVerse).toHaveBeenCalledTimes(MAX_CACHE_SIZE + 2);
  });

  it('clears the cache', async () => {
    (getTafsirByVerse as jest.Mock).mockResolvedValue('first');
    await getTafsirCached('1:1');
    clearTafsirCache();
    (getTafsirByVerse as jest.Mock).mockResolvedValue('second');
    const result = await getTafsirCached('1:1');
    expect(result).toBe('second');
    expect(getTafsirByVerse).toHaveBeenCalledTimes(2);
  });
});
