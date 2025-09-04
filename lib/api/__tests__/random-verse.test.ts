import { getRandomVerse, clearSurahListCache } from '@/lib/api/verses';
import { getSurahList } from '@/lib/api/chapters';
import { apiFetch } from '@/lib/api/client';
import { Verse } from '@/types';
import type { RawVerse } from './apiMocks';

jest.mock('@/lib/api/chapters');
jest.mock('@/lib/api/client');

describe('getRandomVerse', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    clearSurahListCache();
  });

  const mockSurahs = [
    { number: 1, name: 'Al-Fatihah', arabicName: 'الفاتحة', verses: 7, meaning: '' },
    { number: 2, name: 'Al-Baqarah', arabicName: 'البقرة', verses: 286, meaning: '' },
  ];

  it('uses Math.random by default', async () => {
    (getSurahList as jest.Mock).mockResolvedValue(mockSurahs);
    (apiFetch as jest.Mock).mockResolvedValue({
      verse: { id: 5, verse_key: '2:72', text_uthmani: 'test' } as Verse,
    });

    const mathSpy = jest.spyOn(Math, 'random').mockReturnValueOnce(0.5).mockReturnValueOnce(0.25);

    const verse = await getRandomVerse(20);

    expect(mathSpy).toHaveBeenCalledTimes(2);
    expect(apiFetch).toHaveBeenCalledWith(
      'verses/by_key/2:72',
      { translations: '20', fields: 'text_uthmani' },
      'Failed to fetch random verse'
    );
    expect(verse).toMatchObject({ id: 5, verse_key: '2:72', text_uthmani: 'test' });
  });

  it('uses provided RNG when supplied', async () => {
    (getSurahList as jest.Mock).mockResolvedValue(mockSurahs);
    (apiFetch as jest.Mock).mockResolvedValue({
      verse: { id: 1, verse_key: '1:1', text_uthmani: 'alpha' } as Verse,
    });

    const rng = jest.fn().mockReturnValueOnce(0).mockReturnValueOnce(0);

    const verse = await getRandomVerse(20, rng);

    expect(rng).toHaveBeenCalledTimes(2);
    expect(apiFetch).toHaveBeenCalledWith(
      'verses/by_key/1:1',
      { translations: '20', fields: 'text_uthmani' },
      'Failed to fetch random verse'
    );
    expect(verse).toMatchObject({ id: 1, verse_key: '1:1', text_uthmani: 'alpha' });
  });

  it('caches surah list between calls', async () => {
    (getSurahList as jest.Mock).mockResolvedValue(mockSurahs);
    (apiFetch as jest.Mock).mockResolvedValue({
      verse: { id: 1, verse_key: '1:1', text_uthmani: 'alpha' } as Verse,
    });

    await getRandomVerse(20, () => 0);
    await getRandomVerse(20, () => 0);

    expect(getSurahList).toHaveBeenCalledTimes(1);
  });

  it('can clear cached surah list', async () => {
    (getSurahList as jest.Mock).mockResolvedValue(mockSurahs);
    (apiFetch as jest.Mock).mockResolvedValue({
      verse: { id: 1, verse_key: '1:1', text_uthmani: 'alpha' } as Verse,
    });

    await getRandomVerse(20, () => 0);
    clearSurahListCache();
    await getRandomVerse(20, () => 0);

    expect(getSurahList).toHaveBeenCalledTimes(2);
  });

  it('falls back to local verse on API error', async () => {
    (getSurahList as jest.Mock).mockRejectedValue(new Error('fail'));

    const verse = await getRandomVerse(20);

    expect(verse).toMatchObject({ id: expect.any(Number), verse_key: expect.any(String) });
  });
});
