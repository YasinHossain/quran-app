import juzData from '@/data/juz.json';

import type { JuzSummary } from './types';

const ALL_JUZS: ReadonlyArray<JuzSummary> = Object.freeze(
  (juzData as JuzSummary[]).map((juz) => ({
    ...juz,
  }))
);

const ALL_PAGES: ReadonlyArray<number> = Object.freeze(
  Array.from({ length: 604 }, (_, index) => index + 1)
);

export function getAllJuzs(): ReadonlyArray<JuzSummary> {
  return ALL_JUZS;
}

export function getAllPages(): ReadonlyArray<number> {
  return ALL_PAGES;
}
