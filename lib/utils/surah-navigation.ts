import { Chapter } from '@/types';

export const JUZ_START_PAGES = [
  1, 22, 42, 62, 82, 102, 121, 142, 162, 182, 201, 222, 242, 262, 282, 302, 322, 342, 362, 382, 402,
  422, 442, 462, 482, 502, 522, 542, 562, 582,
];

export const getJuzByPage = (page: number): number => {
  for (let i = JUZ_START_PAGES.length - 1; i >= 0; i--) {
    if (page >= JUZ_START_PAGES[i]) return i + 1;
  }
  return 1;
};

export const getSurahByPage = (page: number, chapters: Chapter[]) =>
  chapters.find((c) => c.pages && page >= c.pages[0] && page <= c.pages[1]);
