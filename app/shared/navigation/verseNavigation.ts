/**
 * Verse addressing for the verse pages (`/surah/[surahId]/[verseId]`). Verse counts always come
 * from chapter data (`verses_count`), never from a hand-written table.
 */

export interface VerseAddress {
  surahId: number;
  verseId: number;
}

/** Index 0 is surah 1. */
export type VerseCounts = ReadonlyArray<number>;

// Canonical numbers only: no signs, leading zeros, decimals or trailing text (`02`, `2.0`, `2abc`).
const CANONICAL_NUMBER = /^[1-9]\d{0,2}$/;

const parseCanonicalNumber = (raw: string): number | null =>
  CANONICAL_NUMBER.test(raw) ? Number(raw) : null;

/** Verse count of `surahId`, or 0 when the surah does not exist. */
export function getVerseCount(verseCounts: VerseCounts, surahId: number): number {
  return verseCounts[surahId - 1] ?? 0;
}

/**
 * Parses route params into a verse address. Returns `null` for anything that is not an existing
 * verse (non-numeric, zero, out of range, unknown surah) so the route can 404.
 */
export function parseVerseAddress(
  rawSurahId: string,
  rawVerseId: string,
  verseCounts: VerseCounts
): VerseAddress | null {
  const surahId = parseCanonicalNumber(rawSurahId);
  const verseId = parseCanonicalNumber(rawVerseId);
  if (surahId === null || verseId === null) return null;
  if (verseId > getVerseCount(verseCounts, surahId)) return null;
  return { surahId, verseId };
}

/** Previous verse in mushaf order; crosses into the previous surah (2:1 → 1:7). */
export function getPreviousVerse(
  address: VerseAddress,
  verseCounts: VerseCounts
): VerseAddress | null {
  if (address.verseId > 1) return { surahId: address.surahId, verseId: address.verseId - 1 };
  const previousSurah = address.surahId - 1;
  const count = getVerseCount(verseCounts, previousSurah);
  return count > 0 ? { surahId: previousSurah, verseId: count } : null;
}

/** Next verse in mushaf order; crosses into the next surah (1:7 → 2:1). 114:6 has none. */
export function getNextVerse(address: VerseAddress, verseCounts: VerseCounts): VerseAddress | null {
  if (address.verseId < getVerseCount(verseCounts, address.surahId)) {
    return { surahId: address.surahId, verseId: address.verseId + 1 };
  }
  const nextSurah = address.surahId + 1;
  return getVerseCount(verseCounts, nextSurah) > 0 ? { surahId: nextSurah, verseId: 1 } : null;
}

export const formatVerseKey = (address: VerseAddress): string =>
  `${address.surahId}:${address.verseId}`;
