import { getVerseWithCache, clearCache, __verseCache } from '@/app/(features)/bookmarks/hooks/verseCache';

import type { Verse, Chapter } from '@/types';

jest.mock('@/lib/api', () => ({
  getVerseById: jest.fn(),
  getVerseByKey: jest.fn(),
}));

const { getVerseById, getVerseByKey } = jest.requireMock('@/lib/api') as {
  getVerseById: jest.Mock;
  getVerseByKey: jest.Mock;
};

const sampleVerse = (id: number, key: string): Verse =>
  ({
    id,
    verse_key: key,
    verse_number: id,
    text_uthmani: '',
    translations: [],
  }) as unknown as Verse;

const chaptersMock: Chapter[] = [
  {
    id: 1,
    name_simple: 'Al-Fatihah',
    name_arabic: 'الفاتحة',
    revelation_place: 'makkah',
    verses_count: 7,
  },
  {
    id: 2,
    name_simple: 'Al-Baqarah',
    name_arabic: 'البقرة',
    revelation_place: 'madinah',
    verses_count: 286,
  },
];

describe('getVerseWithCache', () => {
  beforeEach(() => {
    clearCache();
    getVerseById.mockReset();
    getVerseByKey.mockReset();
  });

  it('fetches by key when verseId contains ":"', async () => {
    getVerseByKey.mockResolvedValue(sampleVerse(1, '2:255'));

    const verse = await getVerseWithCache('2:255', [20], chaptersMock, 'en');

    expect(getVerseByKey).toHaveBeenCalledWith('2:255', [20], 'en');
    expect(getVerseById).not.toHaveBeenCalled();
    expect(verse.verse_key).toBe('2:255');
  });

  it('fetches by numeric id when verseId is digits only', async () => {
    getVerseByKey.mockResolvedValue(sampleVerse(262, '2:255'));

    const verse = await getVerseWithCache('262', [20], chaptersMock, 'en');

    expect(getVerseByKey).toHaveBeenCalledWith('2:255', [20], 'en');
    expect(getVerseById).not.toHaveBeenCalled();
    expect(verse.id).toBe(262);
  });

  it('caches results for repeated lookups', async () => {
    getVerseByKey.mockResolvedValue(sampleVerse(10, '1:10'));

    await getVerseWithCache('10', [20], chaptersMock, 'en');
    const cached = await getVerseWithCache('10', [20], chaptersMock, 'en');

    expect(getVerseByKey).toHaveBeenCalledTimes(1);
    expect(__verseCache.size).toBe(1);
    expect(cached.id).toBe(10);
  });

  it('falls back to direct ID lookup when key request fails', async () => {
    getVerseByKey.mockImplementationOnce(() => {
      throw new Error('failed');
    });
    getVerseById.mockResolvedValue(sampleVerse(3, '1:3'));

    const verse = await getVerseWithCache('3', [20], chaptersMock, 'en');

    expect(getVerseByKey).toHaveBeenCalledWith('1:3', [20], 'en');
    expect(getVerseById).toHaveBeenCalledWith('3', [20], 'en');
    expect(verse.verse_key).toBe('1:3');
  });
});
