import { getJuzByPage, getSurahByPage, JUZ_START_PAGES } from '@/lib/utils/surah-navigation';

import type { Chapter } from '@/types';

const chapters: Chapter[] = [
  {
    id: 1,
    name_simple: 'Al-Fatihah',
    name_arabic: 'الفاتحة',
    revelation_place: 'makkah',
    verses_count: 7,
    pages: [1, 1],
  },
  {
    id: 2,
    name_simple: 'Al-Baqarah',
    name_arabic: 'البقرة',
    revelation_place: 'madinah',
    verses_count: 286,
    pages: [2, 49],
  },
  {
    id: 3,
    name_simple: 'Ali Imran',
    name_arabic: 'آل عمران',
    revelation_place: 'madinah',
    verses_count: 200,
    pages: [50, 76],
  },
];

describe('surah-navigation utilities', () => {
  it('determines Juz by page', () => {
    expect(getJuzByPage(1)).toBe(1);
    expect(getJuzByPage(JUZ_START_PAGES[1]!)).toBe(2);
    expect(getJuzByPage(100)).toBeGreaterThan(2);
  });

  it('finds surah by page', () => {
    expect(getSurahByPage(1, chapters)?.id).toBe(1);
    expect(getSurahByPage(40, chapters)?.id).toBe(2);
    expect(getSurahByPage(60, chapters)?.id).toBe(3);
    expect(getSurahByPage(200, chapters)).toBeUndefined();
  });
});
