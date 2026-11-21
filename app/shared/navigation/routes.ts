import { resolveSurahParam } from '@/lib/seo/surahSlugs';

const encodeParam = (value: number | string): string => encodeURIComponent(String(value));

/**
 * Surah URL segment: the canonical slug (`al-baqarah`) for a surah number, slug or known spelling;
 * anything else is passed through encoded (and 404s).
 */
export const surahSegment = (surahId: number | string): string =>
  resolveSurahParam(String(surahId).trim())?.slug ?? encodeParam(surahId);

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
  const base = `/surah/${surahSegment(surahId)}`;
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

/**
 * Dedicated, indexable page for one verse (`/surah/al-baqarah/255`). Use it for links meant to be shared
 * or crawled; in-reader jumps keep `buildSurahRoute(id, { startVerse })` (no page load).
 */
export const buildVerseRoute = (surahId: number | string, verseId: number | string): string =>
  `/surah/${surahSegment(surahId)}/${encodeParam(verseId)}`;

/** Indexable overview of one surah (`/surah/al-alaq/about`): facts, position, first/last verse. */
export const buildSurahAboutRoute = (surahId: number | string): string =>
  `/surah/${surahSegment(surahId)}/about`;

export const buildJuzRoute = (juzId: number | string): string => `/juz/${encodeParam(juzId)}`;

export const buildPageRoute = (pageNumber: number | string): string =>
  `/page/${encodeParam(pageNumber)}`;

export const buildTafsirRoute = (surahId: number | string, verseId: number | string): string =>
  `/tafsir/${surahSegment(surahId)}/${encodeParam(verseId)}`;

/** Tafsir route for a `surah:verse` key (`2:255` -> `/tafsir/al-baqarah/255`). */
export const tafsirHrefForVerseKey = (verseKey: string): string => {
  const [surahId = '', verseId = ''] = verseKey.split(':');
  return buildTafsirRoute(surahId, verseId);
};

export const buildSearchRoute = (query: string): string => `/search?query=${encodeParam(query)}`;
