import { getSurahSlug, resolveSurahParam } from '@/lib/seo/surahSlugs';

const VERSE_SHORTCUT = /^\/([1-9]\d{0,2})\/([1-9]\d{0,2})$/;
const SURAH_ROUTE = /^\/(surah|tafsir)\/([^/]+)(\/[^/]+)?$/;

/**
 * Canonical form of a surah, verse or tafsir path (without its language prefix), or `null` when
 * the path already is canonical or is not one of these routes. Used by `proxy.ts` for one-hop
 * permanent redirects:
 * - `/2/255` -> `/surah/al-baqarah/255` (verse shortcut, never canonical)
 * - `/surah/2`, `/surah/baqarah` -> `/surah/al-baqarah`
 * - `/surah/2/255`, `/tafsir/yaseen/1` -> `/surah/al-baqarah/255`, `/tafsir/ya-sin/1`
 * Unknown surahs return `null` (no redirect) so the route 404s instead of looping. Verse numbers
 * are kept as given; the verse route validates them.
 */
export function getCanonicalQuranPath(pathname: string): string | null {
  const shortcut = VERSE_SHORTCUT.exec(pathname);
  if (shortcut) {
    const slug = getSurahSlug(Number(shortcut[1]));
    return slug ? `/surah/${slug}/${shortcut[2]}` : null;
  }

  const route = SURAH_ROUTE.exec(pathname);
  if (!route) return null;
  const [, kind, segment = '', rest = ''] = route;
  const surah = resolveSurahParam(segment);
  if (!surah || surah.canonical) return null;
  return `/${kind}/${surah.slug}${rest}`;
}
