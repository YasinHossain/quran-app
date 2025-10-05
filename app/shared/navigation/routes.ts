const encodeParam = (value: number | string): string => encodeURIComponent(String(value));

export const buildSurahRoute = (surahId: number | string): string =>
  `/surah/${encodeParam(surahId)}`;

export const buildJuzRoute = (juzId: number | string): string => `/juz/${encodeParam(juzId)}`;

export const buildPageRoute = (pageNumber: number | string): string =>
  `/page/${encodeParam(pageNumber)}`;

export const buildTafsirRoute = (surahId: number | string, verseId: number | string): string =>
  `/tafsir/${encodeParam(surahId)}/${encodeParam(verseId)}`;

export const buildSearchRoute = (query: string): string => `/search?query=${encodeParam(query)}`;
