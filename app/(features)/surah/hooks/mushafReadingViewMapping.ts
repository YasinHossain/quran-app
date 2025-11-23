import type { MushafPageLines, MushafVerse, MushafWord } from '@/types';

const toVerseSortValue = (verseKey?: string): number => {
  if (!verseKey) return Number.MAX_SAFE_INTEGER;
  const [chapterRaw, ayahRaw] = verseKey.split(':');
  const chapter = Number.parseInt(chapterRaw ?? '', 10);
  const ayah = Number.parseInt(ayahRaw ?? '', 10);
  if (Number.isFinite(chapter) && Number.isFinite(ayah)) {
    return chapter * 1000 + ayah;
  }
  if (Number.isFinite(ayah)) {
    return ayah;
  }
  return Number.MAX_SAFE_INTEGER;
};

const createLineKey = (pageNumber: number, lineNumber: number): string =>
  `${pageNumber}:${lineNumber}`;

const sortWordsByPosition = (words: MushafWord[]): MushafWord[] =>
  [...words].sort((a, b) => a.position - b.position);

const groupLinesForPage = (pageNumber: number, verses: MushafVerse[]): MushafPageLines['lines'] => {
  const lineBuckets = new Map<number, MushafWord[]>();

  const orderedVerses = [...verses].sort(
    (a, b) => toVerseSortValue(a.verseKey) - toVerseSortValue(b.verseKey)
  );

  orderedVerses.forEach((verse) => {
    const orderedWords = sortWordsByPosition(verse.words);
    orderedWords.forEach((word) => {
      if (typeof word.lineNumber !== 'number') return;
      const bucket = lineBuckets.get(word.lineNumber);
      if (bucket) {
        bucket.push(word);
      } else {
        lineBuckets.set(word.lineNumber, [word]);
      }
    });
  });

  return Array.from(lineBuckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([lineNumber, words]) => ({
      lineNumber,
      key: createLineKey(pageNumber, lineNumber),
      words,
    }));
};

export const mapVersesToPage = (pageNumber: number, verses: MushafVerse[]): MushafPageLines => ({
  pageNumber,
  lines: groupLinesForPage(pageNumber, verses),
});

export const insertPageSorted = (
  pages: MushafPageLines[],
  page: MushafPageLines
): MushafPageLines[] => {
  const withoutDuplicate = pages.filter((existing) => existing.pageNumber !== page.pageNumber);
  return [...withoutDuplicate, page].sort((a, b) => a.pageNumber - b.pageNumber);
};

export const filterVersesForResource = (
  verses: MushafVerse[],
  resourceKind: 'surah' | 'juz' | 'page',
  chapterId?: number | null,
  juzNumber?: number | null
): MushafVerse[] => {
  if (resourceKind === 'surah' && typeof chapterId === 'number') {
    return verses.filter((verse) => Number(verse.chapterId) === chapterId);
  }
  if (resourceKind === 'juz' && typeof juzNumber === 'number') {
    return verses.filter((verse) => verse.juzNumber === juzNumber);
  }
  return verses;
};

export const mapVersesCollectionToPages = (verses: MushafVerse[]): MushafPageLines[] => {
  if (!verses.length) return [];
  const buckets = new Map<number, MushafVerse[]>();
  verses.forEach((verse) => {
    const bucket = buckets.get(verse.pageNumber);
    if (bucket) {
      bucket.push(verse);
    } else {
      buckets.set(verse.pageNumber, [verse]);
    }
  });
  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([pageNumber, versesForPage]) => mapVersesToPage(pageNumber, versesForPage));
};
