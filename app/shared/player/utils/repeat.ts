import { parseVerseKey } from '@/lib/utils/verse';

import type { RepeatOptions } from '@/app/shared/player/types';
import type { Chapter } from '@/types';

const clampVerseNumber = (value?: number, max?: number): number => {
  const normalized = Number.isFinite(value) ? Math.max(1, Math.trunc(value as number)) : 1;
  if (!Number.isFinite(max)) return normalized;
  return Math.min(normalized, Math.trunc(max as number));
};

export function hasNonIntegerValues(opts: RepeatOptions): boolean {
  const numericKeys: (keyof RepeatOptions)[] = [
    'start',
    'end',
    'surahId',
    'verseNumber',
    'startSurahId',
    'startVerseNumber',
    'endSurahId',
    'endVerseNumber',
    'rangeSize',
    'playCount',
    'repeatEach',
    'delay',
  ];
  return numericKeys.some((key) => {
    const val = opts[key];
    return val !== undefined && !Number.isInteger(val);
  });
}

export function adjustRange(opts: RepeatOptions): {
  start: number;
  end: number;
  adjusted: boolean;
} {
  const rawStart = opts.start ?? opts.startVerseNumber ?? 1;
  const start = Math.max(1, rawStart);
  const rawEnd = opts.end ?? opts.endVerseNumber ?? rawStart;
  const end = Math.max(start, rawEnd);
  return { start, end, adjusted: start !== rawStart || end !== rawEnd };
}

export const buildVerseKey = (surahId?: number, verseNumber?: number): string | null => {
  if (!Number.isFinite(surahId) || !Number.isFinite(verseNumber)) return null;
  return `${surahId}:${verseNumber}`;
};

export const compareVerseKeys = (a?: string | null, b?: string | null): number => {
  if (!a || !b) return 0;
  const { surahNumber: surahA, ayahNumber: ayahA } = parseVerseKey(a);
  const { surahNumber: surahB, ayahNumber: ayahB } = parseVerseKey(b);
  if (!surahA || !surahB || !ayahA || !ayahB) return 0;
  if (surahA !== surahB) return surahA - surahB;
  return ayahA - ayahB;
};

export function calculateRangeSize(
  startSurahId: number,
  startVerseNumber: number,
  endSurahId: number,
  endVerseNumber: number,
  chapters: Chapter[]
): number | null {
  if (
    !Number.isFinite(startSurahId) ||
    !Number.isFinite(endSurahId) ||
    !Number.isFinite(startVerseNumber) ||
    !Number.isFinite(endVerseNumber)
  ) {
    return null;
  }

  const ordered = [...chapters].sort((a, b) => a.id - b.id);
  const startIndex = ordered.findIndex((chapter) => chapter.id === startSurahId);
  const endIndex = ordered.findIndex((chapter) => chapter.id === endSurahId);

  if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) return null;

  let total = 0;
  for (let idx = startIndex; idx <= endIndex; idx += 1) {
    const chapter = ordered[idx]!;
    const versesCount = chapter.verses_count ?? 0;
    if (versesCount <= 0) return null;

    if (idx === startIndex && idx === endIndex) {
      if (endVerseNumber < startVerseNumber) return null;
      total += endVerseNumber - startVerseNumber + 1;
    } else if (idx === startIndex) {
      total += versesCount - startVerseNumber + 1;
    } else if (idx === endIndex) {
      total += endVerseNumber;
    } else {
      total += versesCount;
    }
  }

  return total;
}

export function deriveRangeBoundaries(
  opts: RepeatOptions,
  chapters: Chapter[]
): {
  startSurahId: number;
  startVerseNumber: number;
  endSurahId: number;
  endVerseNumber: number;
  startKey: string;
  endKey: string;
  rangeSize: number;
} | null {
  const startSurahId = opts.startSurahId ?? opts.surahId;
  const endSurahId = opts.endSurahId ?? startSurahId;
  if (!startSurahId || !endSurahId) return null;

  const startChapter = chapters.find((chapter) => chapter.id === startSurahId);
  const endChapter = chapters.find((chapter) => chapter.id === endSurahId);
  if (!startChapter || !endChapter) return null;

  const startVerseNumber = clampVerseNumber(
    opts.startVerseNumber ?? opts.start ?? opts.verseNumber ?? 1,
    startChapter.verses_count
  );
  const endVerseNumber = clampVerseNumber(
    opts.endVerseNumber ?? opts.end ?? startVerseNumber,
    endChapter.verses_count
  );

  if (startSurahId === endSurahId && startVerseNumber > endVerseNumber) return null;
  if (startSurahId > endSurahId) return null;

  const rangeSize = calculateRangeSize(
    startSurahId,
    startVerseNumber,
    endSurahId,
    endVerseNumber,
    chapters
  );
  if (!rangeSize) return null;

  const startKey = buildVerseKey(startSurahId, startVerseNumber);
  const endKey = buildVerseKey(endSurahId, endVerseNumber);
  if (!startKey || !endKey) return null;

  return {
    startSurahId,
    startVerseNumber,
    endSurahId,
    endVerseNumber,
    startKey,
    endKey,
    rangeSize,
  };
}
