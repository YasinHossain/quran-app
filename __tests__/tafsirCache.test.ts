import { getTafsirCached, clearTafsirCache, CACHE_TTL, MAX_CACHE_SIZE } from '@/lib/tafsirCache';
import { getTafsirByVerse } from '@/lib/api';

jest.mock('@/lib/api', () => ({
  getTafsirByVerse: jest.fn(),
}));

describe('getTafsirCached', () => {
  beforeEach(() => {
    clearTafsirCache();
    jest.resetAllMocks();
  });

  it('returns cached promise within TTL', async () => {
    (getTafsirByVerse as jest.Mock).mockResolvedValue('text1');
    jest.spyOn(Date, 'now').mockReturnValue(0);
    const p1 = getTafsirCached('1:1', 1);
    const p2 = getTafsirCached('1:1', 1);
    expect(p2).toBe(p1);
    await p1;
    expect(getTafsirByVerse).toHaveBeenCalledTimes(1);
  });

  it('evicts entry after TTL expires', async () => {
    const spy = jest.spyOn(Date, 'now');
    spy.mockReturnValue(0);
    (getTafsirByVerse as jest.Mock).mockResolvedValue('text1');
    await getTafsirCached('1:1', 1);

    spy.mockReturnValue(CACHE_TTL + 1);
    (getTafsirByVerse as jest.Mock).mockResolvedValue('text2');
    await getTafsirCached('1:1', 1);

    expect(getTafsirByVerse).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });

  it('forces subsequent fetch after cache is cleared', async () => {
    (getTafsirByVerse as jest.Mock).mockResolvedValue('text1');
    await getTafsirCached('1:1', 1);
    expect(getTafsirByVerse).toHaveBeenCalledTimes(1);

    clearTafsirCache();

    (getTafsirByVerse as jest.Mock).mockResolvedValue('text2');
    await getTafsirCached('1:1', 1);

    expect(getTafsirByVerse).toHaveBeenCalledTimes(2);
  });

  it('removes oldest when max size exceeded', async () => {
    const spy = jest.spyOn(Date, 'now').mockReturnValue(0);
    for (let i = 0; i < MAX_CACHE_SIZE; i++) {
      (getTafsirByVerse as jest.Mock).mockResolvedValue(String(i));
      await getTafsirCached(`1:${i}`, 1);
    }

    (getTafsirByVerse as jest.Mock).mockResolvedValue('new');
    await getTafsirCached('1:new', 1);

    (getTafsirByVerse as jest.Mock).mockResolvedValue('again');
    await getTafsirCached('1:0', 1);

    expect(getTafsirByVerse).toHaveBeenCalledTimes(MAX_CACHE_SIZE + 2);
    spy.mockRestore();
  });
});
