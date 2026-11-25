import wordCounts from '@/data/verse-word-counts.json';

/**
 * Word statistics for the surah overview page, from `data/verse-word-counts.json` (Quran.com's
 * word-by-word data: verse-end markers and pause signs are not words).
 */

const WORD_COUNTS = wordCounts as ReadonlyArray<ReadonlyArray<number>>;

/** Words in each verse of the surah (index 0 = verse 1), or `null` for an unknown surah. */
export function getVerseWordCounts(surahId: number): ReadonlyArray<number> | null {
  return WORD_COUNTS[surahId - 1] ?? null;
}

export interface VerseExtreme {
  /** First verse (1-based) with this word count. */
  verse: number;
  words: number;
  /** How many other verses share the same count. */
  others: number;
}

export interface SurahWordStats {
  totalWords: number;
  longest: VerseExtreme;
  shortest: VerseExtreme;
  perVerse: ReadonlyArray<number>;
}

function extreme(
  counts: ReadonlyArray<number>,
  pick: (a: number, b: number) => number
): VerseExtreme {
  const words = counts.reduce((a, b) => pick(a, b));
  const matches = counts.filter((count) => count === words).length;
  return { verse: counts.indexOf(words) + 1, words, others: matches - 1 };
}

export function buildSurahWordStats(surahId: number): SurahWordStats | null {
  const perVerse = getVerseWordCounts(surahId);
  if (!perVerse?.length) return null;
  return {
    totalWords: perVerse.reduce((sum, count) => sum + count, 0),
    longest: extreme(perVerse, Math.max),
    shortest: extreme(perVerse, Math.min),
    perVerse,
  };
}

/** Whole minutes and remaining seconds of a recitation (rounded to the nearest second). */
export function splitDuration(durationMs: number): { minutes: number; seconds: number } {
  const total = Math.max(0, Math.round(durationMs / 1000));
  return { minutes: Math.floor(total / 60), seconds: total % 60 };
}

/** Hours and remaining minutes (rounded to the nearest minute), for recitations of an hour or more. */
export function splitHoursMinutes(durationMs: number): { hours: number; minutes: number } {
  const total = Math.max(0, Math.round(durationMs / 60000));
  return { hours: Math.floor(total / 60), minutes: total % 60 };
}
