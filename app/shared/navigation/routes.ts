const encodeParam = (value: number | string): string => encodeURIComponent(String(value));

const normalizeStartVerse = (startVerse?: number | string | null): string | null => {
  if (startVerse === undefined || startVerse === null) return null;
  const numeric =
    typeof startVerse === 'number' ? startVerse : Number.parseInt(String(startVerse).trim(), 10);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return null;
  }
  return String(Math.floor(numeric));
};

interface SurahRouteOptions {
  startVerse?: number | string | null;
  forceSeq?: boolean;
}

export const buildSurahRoute = (surahId: number | string, options?: SurahRouteOptions): string => {
  const base = `/surah/${encodeParam(surahId)}`;
  const normalizedStartVerse = normalizeStartVerse(options?.startVerse);
  const shouldIncludeSeq = options?.forceSeq === true;

  if (!normalizedStartVerse && !shouldIncludeSeq) return base;

  // Use the URL fragment for client-only navigation state (verse position, navigation nonce).
  // This keeps the server-rendered route cache stable and avoids turning `/surah/:id` into a
  // distinct cache key for each `startVerse`/`nav` combination.
  const params = new URLSearchParams();
  if (normalizedStartVerse) {
    params.set('startVerse', normalizedStartVerse);
  }
  if (shouldIncludeSeq) {
    params.set('nav', String(Date.now()));
  }
  return `${base}#${params.toString()}`;
};

export const buildJuzRoute = (juzId: number | string): string => `/juz/${encodeParam(juzId)}`;

export const buildPageRoute = (pageNumber: number | string): string =>
  `/page/${encodeParam(pageNumber)}`;

export const buildTafsirRoute = (surahId: number | string, verseId: number | string): string =>
  `/tafsir/${encodeParam(surahId)}/${encodeParam(verseId)}`;

export const buildSearchRoute = (query: string): string => `/search?query=${encodeParam(query)}`;
