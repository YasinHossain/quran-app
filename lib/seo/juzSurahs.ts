import { getAllJuzs } from '@/app/shared/navigation/datasets';
import { getSurahSlug, getSurahVerseCount } from '@/lib/seo/surahSlugs';

import type { ServerTranslator } from '@/app/shared/i18n/serverLocale';
import type { JuzSummary } from '@/app/shared/navigation/types';

export interface JuzSurahRange {
  surahId: number;
  slug: string;
  /** First verse of the surah that falls inside the juz. */
  startAyah: number;
  /** Last verse of the surah that falls inside the juz. */
  endAyah: number;
}

/**
 * Surahs (fully or partly) inside a juz, in reading order, with the verse range each one has in
 * it. Derived from the juz boundaries in `data/juz.json` and the surah verse counts: the first
 * surah starts at the juz's start verse, the last ends at its end verse, and every surah in
 * between is complete.
 */
export function getJuzSurahRanges(juz: JuzSummary): JuzSurahRange[] {
  const { startSurahId, endSurahId, startAyah = 1 } = juz;
  if (!startSurahId || !endSurahId || endSurahId < startSurahId) return [];

  const ranges: JuzSurahRange[] = [];
  for (let surahId = startSurahId; surahId <= endSurahId; surahId += 1) {
    const slug = getSurahSlug(surahId);
    if (!slug) continue;
    const verseCount = getSurahVerseCount(surahId);
    ranges.push({
      surahId,
      slug,
      startAyah: surahId === startSurahId ? startAyah : 1,
      endAyah: surahId === endSurahId ? (juz.endAyah ?? verseCount) : verseCount,
    });
  }
  return ranges;
}

/** "Juz 30 – Surahs An-Naba to An-Nas (78–114)": names the first and last surah of the juz. */
export function buildJuzTitle(
  translator: ServerTranslator,
  juzId: string,
  juz?: JuzSummary
): string {
  const juzLabel = translator.t('juz_number', { number: juz?.number ?? juzId });
  const ranges = juz ? getJuzSurahRanges(juz) : [];
  const first = ranges[0];
  const last = ranges[ranges.length - 1];
  if (!first || !last) return juzLabel;

  if (first.surahId === last.surahId) {
    return translator.t('seo_juz_title_single', {
      juz: juzLabel,
      name: translator.surahName(first.surahId),
      number: first.surahId,
    });
  }

  return translator.t('seo_juz_title', {
    juz: juzLabel,
    first: translator.surahName(first.surahId),
    last: translator.surahName(last.surahId),
    firstNumber: first.surahId,
    lastNumber: last.surahId,
  });
}

/** Only canonical numbers "1"–"30" name a juz ("0", "31", "abc", "01" and "1abc" do not). */
export function findJuzById(juzId: string): JuzSummary | undefined {
  return /^[1-9]\d?$/.test(juzId)
    ? getAllJuzs().find((juz) => juz.number === Number(juzId))
    : undefined;
}
