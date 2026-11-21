import juzData from '@/data/juz.json';

/**
 * Which surah pages show the Latin transliteration in their full-text section.
 *
 * The transliteration roughly doubles the full text's weight in the HTML and the RSC payload, so
 * long surahs skip it (verse pages always show it). Surah pages carry it only for Al-Fatihah and
 * the surahs that lie wholly in Juz 30 (78–114 in the Hafs division): short, widely memorised
 * surahs that people search for with transliteration. The Juz 30 range is derived from
 * `data/juz.json`, not written out by hand.
 */

const AL_FATIHAH = 1;
const LAST_JUZ_NUMBER = 30;

/** Surahs that start and end inside the given juz, from its start/end in `data/juz.json`. */
function surahsWhollyInJuz(juzNumber: number): number[] {
  const juz = juzData.find((entry) => entry.number === juzNumber);
  if (!juz) return [];
  // A surah that starts mid-way through the previous juz is not wholly inside this one.
  const first = juz.startAyah === 1 ? juz.startSurahId : juz.startSurahId + 1;
  return Array.from({ length: Math.max(0, juz.endSurahId - first + 1) }, (_, i) => first + i);
}

const FULL_TEXT_TRANSLITERATION_SURAHS: ReadonlySet<number> = new Set([
  AL_FATIHAH,
  ...surahsWhollyInJuz(LAST_JUZ_NUMBER),
]);

/** Whether the surah page's full text (and its English title/description) has transliteration. */
export function hasFullTextTransliteration(surahId: number): boolean {
  return FULL_TEXT_TRANSLITERATION_SURAHS.has(surahId);
}
