import juzData from '@/data/juz.json';

import type { Chapter } from '@/types';

/**
 * Facts for the "About this surah" page, derived only from chapter data (Quran.com) and the
 * checked-in juz boundaries (`data/juz.json`). Nothing here is hand-written per surah.
 *
 * Deliberately left out until a scholar decides how to present them (see the SEO plan, 5C):
 * - revelation order: there is more than one traditional list.
 * - sajdah verses: the Quran.com data marks 14 (not 22:77) while the Madinah Mushaf marks 15.
 */

/** Pages in the Madinah Mushaf that Quran.com `pages` refer to. */
export const MUSHAF_PAGE_COUNT = 604;
export const JUZ_COUNT = 30;
export const SURAH_TOTAL = 114;

interface JuzBoundary {
  number: number;
  startSurahId: number;
  startAyah: number;
  endSurahId: number;
  endAyah: number;
}

const JUZ_BOUNDARIES = juzData as ReadonlyArray<JuzBoundary>;

export interface NumberRange {
  start: number;
  end: number;
}

const compareVerse = (aSurah: number, aVerse: number, bSurah: number, bVerse: number): number =>
  aSurah === bSurah ? aVerse - bVerse : aSurah - bSurah;

/** Juz that contains `surahId:verse`, or `null` for an address outside the Quran. */
export function getJuzOfVerse(surahId: number, verse: number): number | null {
  const juz = JUZ_BOUNDARIES.find(
    (item) =>
      compareVerse(surahId, verse, item.startSurahId, item.startAyah) >= 0 &&
      compareVerse(surahId, verse, item.endSurahId, item.endAyah) <= 0
  );
  return juz?.number ?? null;
}

/** First and last juz a surah falls in (its first and last verse). */
export function getSurahJuzRange(surahId: number, versesCount: number): NumberRange | null {
  if (!Number.isInteger(versesCount) || versesCount < 1) return null;
  const start = getJuzOfVerse(surahId, 1);
  const end = getJuzOfVerse(surahId, versesCount);
  return start && end ? { start, end } : null;
}

const isPage = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= MUSHAF_PAGE_COUNT;

export interface SurahFacts {
  id: number;
  /** `null` when the data has no (known) value: the page then says nothing rather than guess. */
  revelation: 'makkah' | 'madinah' | null;
  versesCount: number;
  pages: NumberRange | null;
  juz: NumberRange | null;
  /** True only for a surah whose data says it opens without the Basmala (At-Tawbah). */
  beginsWithoutBasmala: boolean;
}

export function buildSurahFacts(chapter: Chapter): SurahFacts {
  const [startPage, endPage] = chapter.pages ?? [];
  const revelation =
    chapter.revelation_place === 'makkah' || chapter.revelation_place === 'madinah'
      ? chapter.revelation_place
      : null;

  return {
    id: chapter.id,
    revelation,
    versesCount: chapter.verses_count,
    pages:
      isPage(startPage) && isPage(endPage) && startPage <= endPage
        ? { start: startPage, end: endPage }
        : null,
    juz: getSurahJuzRange(chapter.id, chapter.verses_count),
    // Al-Fatihah's Basmala is its first verse, so the data also says `false` there.
    beginsWithoutBasmala: chapter.bismillah_pre === false && chapter.id !== 1,
  };
}

type Translate = (key: string, vars?: Record<string, string | number>) => string;

/** Picks the sentence that matches a one-page/multi-page and one-juz/multi-juz surah. */
function locationSentence(
  t: Translate,
  pages: NumberRange,
  juz: NumberRange,
  digits: (value: number) => string
): string {
  const vars = {
    page: digits(pages.start),
    start: digits(pages.start),
    end: digits(pages.end),
    juz: digits(juz.start),
    juzStart: digits(juz.start),
    juzEnd: digits(juz.end),
  };
  const onePage = pages.start === pages.end;
  const oneJuz = juz.start === juz.end;
  if (onePage && oneJuz) return t('surah_about_location_page_juz', vars);
  if (onePage) return t('surah_about_location_page_juz_range', vars);
  if (oneJuz) return t('surah_about_location_pages_juz', vars);
  return t('surah_about_location_pages_juz_range', vars);
}

/**
 * The page's lead paragraph (and meta description), as template sentences filled with facts, e.g.
 * "Al-Alaq is surah 96 of the 114 surahs of the Quran. It is a Meccan surah of 19 verses. It is on
 * page 597 of the Mushaf, in Juz 30." Sentences whose facts are missing are left out.
 */
export function buildSurahSummary(input: {
  t: Translate;
  facts: SurahFacts;
  name: string;
  digits: (value: number) => string;
}): string[] {
  const { t, facts, name, digits } = input;
  const sentences = [
    t('surah_about_summary_position', {
      name,
      number: digits(facts.id),
      total: digits(SURAH_TOTAL),
    }),
  ];
  if (facts.revelation) {
    sentences.push(
      t(
        facts.revelation === 'makkah'
          ? 'surah_about_summary_makkah'
          : 'surah_about_summary_madinah',
        { count: digits(facts.versesCount) }
      )
    );
  } else {
    sentences.push(t('surah_about_summary_verses', { count: digits(facts.versesCount) }));
  }
  if (facts.pages && facts.juz) {
    sentences.push(locationSentence(t, facts.pages, facts.juz, digits));
  }
  return sentences;
}
