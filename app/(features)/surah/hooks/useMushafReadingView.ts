import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { DEFAULT_MUSHAF_ID } from '@/data/mushaf/options';
import {
  getMushafChapterStartPage,
  getMushafJuzStartPage,
  getReadingViewPage,
} from '@infra/quran/readingViewClient';

import type { MushafPageLines, MushafVerse, MushafWord } from '@/types';

const DEFAULT_PAGE_NUMBER = 1;
const GENERIC_ERROR_MESSAGE = 'Failed to load Mushaf data.';

export type MushafResourceKind = 'surah' | 'juz' | 'page';

export interface UseMushafReadingViewParams {
  resourceId: string;
  resourceKind: MushafResourceKind;
  mushafId?: string | undefined;
  initialPageNumber?: number;
  chapterId?: number | null;
  juzNumber?: number | null;
  initialData?: MushafVerse[];
  reciterId?: number;
  wordByWordLocale?: string;
  translationIds?: string;
}

export interface UseMushafReadingViewResult {
  pages: MushafPageLines[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => void;
}

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

const mapVersesToPage = (pageNumber: number, verses: MushafVerse[]): MushafPageLines => ({
  pageNumber,
  lines: groupLinesForPage(pageNumber, verses),
});

const insertPageSorted = (pages: MushafPageLines[], page: MushafPageLines): MushafPageLines[] => {
  const withoutDuplicate = pages.filter((existing) => existing.pageNumber !== page.pageNumber);
  return [...withoutDuplicate, page].sort((a, b) => a.pageNumber - b.pageNumber);
};

const filterVersesForResource = (
  verses: MushafVerse[],
  resourceKind: MushafResourceKind,
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

const mapVersesCollectionToPages = (verses: MushafVerse[]): MushafPageLines[] => {
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

export function useMushafReadingView({
  resourceId,
  resourceKind,
  mushafId,
  initialPageNumber,
  chapterId,
  juzNumber,
  initialData,
  reciterId,
  wordByWordLocale,
  translationIds,
}: UseMushafReadingViewParams): UseMushafReadingViewResult {
  const initialMappedPages = useMemo(
    () =>
      Array.isArray(initialData) && initialData.length
        ? mapVersesCollectionToPages(
            filterVersesForResource(initialData, resourceKind, chapterId, juzNumber)
          )
        : [],
    [initialData, resourceKind, chapterId, juzNumber]
  );
  const firstInitialPageNumber = initialMappedPages[0]?.pageNumber;
  const numericResourceId = Number.parseInt(resourceId, 10);
  const effectiveMushafId = mushafId ?? DEFAULT_MUSHAF_ID;

  const resolveBaseStartPageNumber = useCallback(() => {
    if (resourceKind === 'page' && Number.isFinite(numericResourceId)) {
      return numericResourceId;
    }
    if (typeof initialPageNumber === 'number' && initialPageNumber > 0) {
      return initialPageNumber;
    }
    if (typeof firstInitialPageNumber === 'number' && firstInitialPageNumber > 0) {
      return firstInitialPageNumber;
    }
    return DEFAULT_PAGE_NUMBER;
  }, [resourceKind, numericResourceId, initialPageNumber, firstInitialPageNumber]);

  const [startPageNumber, setStartPageNumber] = useState<number>(() =>
    resolveBaseStartPageNumber()
  );

  const [pages, setPages] = useState<MushafPageLines[]>(initialMappedPages);
  const [isLoading, setIsLoading] = useState(initialMappedPages.length === 0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(resourceKind !== 'page');
  const [error, setError] = useState<string | null>(null);
  const lastInitialPageNumber =
    initialMappedPages.length > 0
      ? initialMappedPages[initialMappedPages.length - 1]?.pageNumber
      : undefined;
  const [nextPageNumber, setNextPageNumber] = useState<number | null>(() =>
    typeof lastInitialPageNumber === 'number' ? lastInitialPageNumber + 1 : startPageNumber
  );
  const requestTokenRef = useRef(0);
  const startPageResolveTokenRef = useRef(0);

  useEffect(() => {
    setStartPageNumber(resolveBaseStartPageNumber());
  }, [resolveBaseStartPageNumber]);

  useEffect(() => {
    if (resourceKind === 'page' || effectiveMushafId === DEFAULT_MUSHAF_ID) return;
    const token = ++startPageResolveTokenRef.current;

    const resolveStartPageNumber = async (): Promise<void> => {
      try {
        if (resourceKind === 'surah' && typeof chapterId === 'number') {
          const page = await getMushafChapterStartPage({
            chapterId,
            mushafId: effectiveMushafId,
          });
          if (startPageResolveTokenRef.current === token && typeof page === 'number') {
            setStartPageNumber(page);
          }
          return;
        }

        if (resourceKind === 'juz' && typeof juzNumber === 'number') {
          const page = await getMushafJuzStartPage({
            juzNumber,
            mushafId: effectiveMushafId,
          });
          if (startPageResolveTokenRef.current === token && typeof page === 'number') {
            setStartPageNumber(page);
          }
          return;
        }
      } catch {
        // Swallow errors; we'll fall back to the base start page number below.
      }

      if (startPageResolveTokenRef.current === token) {
        setStartPageNumber(resolveBaseStartPageNumber());
      }
    };

    void resolveStartPageNumber();
  }, [resourceKind, chapterId, juzNumber, effectiveMushafId, resolveBaseStartPageNumber]);

  const fetchPage = useCallback(
    async (
      pageNumber: number,
      { isInitial = false, token }: { isInitial?: boolean; token: number }
    ) => {
      if (!Number.isFinite(pageNumber) || pageNumber <= 0) return;

      if (isInitial) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      try {
        const verses = await getReadingViewPage({
          pageNumber,
          mushafId: effectiveMushafId,
          ...(typeof reciterId === 'number' ? { reciterId } : {}),
          ...(wordByWordLocale ? { wordByWordLocale } : {}),
          ...(translationIds ? { translationIds } : {}),
        });
        if (requestTokenRef.current !== token) {
          return;
        }
        const filtered = filterVersesForResource(verses, resourceKind, chapterId, juzNumber);
        if (!filtered.length) {
          setHasMore(false);
          if (isInitial) {
            setPages([]);
          }
          return;
        }
        const mappedPage = mapVersesToPage(pageNumber, filtered);
        setPages((current) => insertPageSorted(current, mappedPage));
        setNextPageNumber(resourceKind === 'page' ? null : pageNumber + 1);
        if (resourceKind === 'page') {
          setHasMore(false);
        }
      } catch (err) {
        if (requestTokenRef.current !== token) {
          return;
        }
        const message = err instanceof Error ? err.message : null;
        if (typeof message === 'string' && message.includes('404')) {
          // Reading view API returns 404 for out-of-range page numbers; treat as end of pagination.
          setHasMore(false);
          if (isInitial) {
            setPages([]);
          }
        } else {
          setError(message ?? GENERIC_ERROR_MESSAGE);
        }
      } finally {
        const isStaleRequest = requestTokenRef.current !== token;
        if (isInitial) {
          if (!isStaleRequest) {
            setIsLoading(false);
          }
        } else if (!isStaleRequest) {
          setIsLoadingMore(false);
        }
      }
    },
    [
      chapterId,
      juzNumber,
      resourceKind,
      effectiveMushafId,
      reciterId,
      wordByWordLocale,
      translationIds,
    ]
  );

  useEffect(() => {
    const token = ++requestTokenRef.current;

    setPages(initialMappedPages);
    setHasMore(resourceKind !== 'page');
    setError(null);
    setIsLoading(initialMappedPages.length === 0);
    setIsLoadingMore(false);
    const lastPageNumber =
      initialMappedPages.length > 0
        ? initialMappedPages[initialMappedPages.length - 1]?.pageNumber
        : undefined;
    setNextPageNumber(typeof lastPageNumber === 'number' ? lastPageNumber + 1 : startPageNumber);

    if (!resourceId) {
      setPages([]);
      setIsLoading(false);
      setError('Missing resource identifier for Mushaf view.');
      setHasMore(false);
      return;
    }

    if (!initialMappedPages.length) {
      void fetchPage(startPageNumber, { isInitial: true, token });
    }
  }, [resourceId, resourceKind, startPageNumber, initialMappedPages, fetchPage, effectiveMushafId]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore || typeof nextPageNumber !== 'number') return;
    const token = requestTokenRef.current;
    void fetchPage(nextPageNumber, { token });
  }, [hasMore, isLoadingMore, nextPageNumber, fetchPage]);

  return {
    pages,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
  };
}
