import { container } from '@/src/infrastructure/di/container';

import { CACHE_TTL, MAX_CACHE_SIZE, clearTafsirCache, getTafsirCached } from '../tafsirCache';

jest.mock('@/src/infrastructure/di/container', () => ({
  container: {
    getTafsirRepository: jest.fn(),
  },
}));

describe('getTafsirCached', () => {
  const repository = { getTafsirByVerse: jest.fn() } as { getTafsirByVerse: jest.Mock };

  beforeEach(() => {
    clearTafsirCache();
    repository.getTafsirByVerse.mockReset();
    (container.getTafsirRepository as jest.Mock).mockReturnValue(repository);
  });

  afterEach(() => {
    jest.useRealTimers();
    clearTafsirCache();
  });

  it('returns cached value on repeated calls', async () => {
    repository.getTafsirByVerse.mockResolvedValue('tafsir');
    const first = await getTafsirCached('1:1', 169);
    const second = await getTafsirCached('1:1', 169);
    expect(first).toBe('tafsir');
    expect(second).toBe('tafsir');
    expect(repository.getTafsirByVerse).toHaveBeenCalledTimes(1);
  });

  it('expires cache entries based on TTL', async () => {
    jest.useFakeTimers();
    repository.getTafsirByVerse.mockResolvedValue('tafsir1');
    jest.setSystemTime(0);
    await getTafsirCached('1:1');
    jest.setSystemTime(CACHE_TTL + 1);
    repository.getTafsirByVerse.mockResolvedValue('tafsir2');
    const result = await getTafsirCached('1:1');
    expect(result).toBe('tafsir2');
    expect(repository.getTafsirByVerse).toHaveBeenCalledTimes(2);
  });

  it('evicts oldest entry when cache limit exceeded', async () => {
    jest.useFakeTimers();
    repository.getTafsirByVerse.mockImplementation((verseKey: string) =>
      Promise.resolve(`tafsir-${verseKey}`)
    );
    for (let i = 0; i < MAX_CACHE_SIZE; i++) {
      jest.setSystemTime(i);
      await getTafsirCached(`${i}:1`);
    }
    expect(repository.getTafsirByVerse).toHaveBeenCalledTimes(MAX_CACHE_SIZE);
    jest.setSystemTime(MAX_CACHE_SIZE);
    await getTafsirCached(`${MAX_CACHE_SIZE}:1`);
    expect(repository.getTafsirByVerse).toHaveBeenCalledTimes(MAX_CACHE_SIZE + 1);
    jest.setSystemTime(MAX_CACHE_SIZE + 1);
    await getTafsirCached('0:1');
    expect(repository.getTafsirByVerse).toHaveBeenCalledTimes(MAX_CACHE_SIZE + 2);
  });

  it('clears the cache', async () => {
    repository.getTafsirByVerse.mockResolvedValue('first');
    await getTafsirCached('1:1');
    clearTafsirCache();
    repository.getTafsirByVerse.mockResolvedValue('second');
    const result = await getTafsirCached('1:1');
    expect(result).toBe('second');
    expect(repository.getTafsirByVerse).toHaveBeenCalledTimes(2);
  });
});
