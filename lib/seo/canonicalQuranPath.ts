import { getSurahSlug, getSurahVerseCount, resolveSurahParam } from '@/lib/seo/surahSlugs';

const VERSE_SHORTCUT = /^\/([1-9]\d{0,2})\/([^/]+)$/;
const SURAH_ROUTE = /^\/(surah|tafsir)\/([^/]+)(?:\/([^/]+))?$/;
const CANONICAL_NUMBER = /^[1-9]\d{0,2}$/;
/** The surah overview page (`/surah/al-alaq/about`); `info` (Quran.com's spelling) redirects to it. */
const ABOUT_SEGMENT = 'about';
const ABOUT_SEGMENTS = new Set([ABOUT_SEGMENT, 'info']);

/** True when `raw` is a canonical verse number that exists in surah `surahId`. */
const isExistingVerse = (surahId: number, raw: string): boolean =>
  CANONICAL_NUMBER.test(raw) && Number(raw) <= getSurahVerseCount(surahId);

/**
 * Canonical form of a surah, verse or tafsir path (without its language prefix), or `null` when
 * the path already is canonical or is not one of these routes. Used by `proxy.ts` for one-hop
 * permanent redirects:
 * - `/2/255` -> `/surah/al-baqarah/255` (verse shortcut, never canonical)
 * - `/surah/2`, `/surah/baqarah` -> `/surah/al-baqarah`
 * - `/surah/2/255`, `/tafsir/yaseen/1` -> `/surah/al-baqarah/255`, `/tafsir/ya-sin/1`
 * - `/surah/96/about`, `/surah/al-alaq/info` -> `/surah/al-alaq/about`
 * Unknown surahs and verse numbers that do not exist (`/surah/2/287`, `/2/0`, `/surah/1/abc`)
 * return `null` (no redirect), so the route 404s directly instead of after a redirect.
 */
export function getCanonicalQuranPath(pathname: string): string | null {
  const shortcut = VERSE_SHORTCUT.exec(pathname);
  if (shortcut) {
    const [, surahId = '', verse = ''] = shortcut;
    const slug = getSurahSlug(Number(surahId));
    return slug && isExistingVerse(Number(surahId), verse) ? `/surah/${slug}/${verse}` : null;
  }

  const route = SURAH_ROUTE.exec(pathname);
  if (!route) return null;
  const [, kind, segment = '', verse] = route;
  const surah = resolveSurahParam(segment);
  if (!surah) return null;
  if (kind === 'surah' && verse !== undefined && ABOUT_SEGMENTS.has(verse.toLowerCase())) {
    return surah.canonical && verse === ABOUT_SEGMENT
      ? null
      : `/surah/${surah.slug}/${ABOUT_SEGMENT}`;
  }
  if (surah.canonical) return null;
  if (verse === undefined) return `/${kind}/${surah.slug}`;
  return isExistingVerse(surah.id, verse) ? `/${kind}/${surah.slug}/${verse}` : null;
}
