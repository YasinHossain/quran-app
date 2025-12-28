import { useEffect, useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';

import type { LookupFn } from './types';
import type { Verse } from '@/types';

export type ApiPageToVersesMap = Record<number, Verse[]>;

interface UseDedupedFetchVerseParams {
  resourceId: string;
  verseIdx: number;
  perPage: number;
  lookup: LookupFn;
  translationIds: number[];
  wordLang: string;
  /** When true, fetches code_v2 and page_number for Tajweed rendering */
  tajweed?: boolean;
  initialPageVerses?: Verse[];
  setApiPageToVersesMap: React.Dispatch<React.SetStateAction<ApiPageToVersesMap>>;
  onError?: (message: string) => void;
  enabled?: boolean;
}

interface UseDedupedFetchVerseResult {
  verse: Verse | null;
  pageNumber: number;
  isLoading: boolean;
}

const getPageNumberFromIndex = (index: number, perPage: number): number =>
  Math.floor(index / perPage) + 1;

export function useDedupedFetchVerse({
  resourceId,
  verseIdx,
  perPage,
  lookup,
  translationIds,
  wordLang,
  tajweed = false,
  initialPageVerses,
  setApiPageToVersesMap,
  onError,
  enabled = true,
}: UseDedupedFetchVerseParams): UseDedupedFetchVerseResult {
  const pageNumber = useMemo(() => getPageNumberFromIndex(verseIdx, perPage), [verseIdx, perPage]);
  const idxInPage = verseIdx % perPage;

  // Include tajweed in the cache key so SWR refetches when tajweed changes
  const requestKey = enabled
    ? ['verses', resourceId, translationIds.join(','), wordLang, pageNumber, perPage, String(tajweed)]
    : null;

  const { data: versesInPage, error, isLoading } = useSWRImmutable<Verse[]>(
    requestKey,
    async () => {
      const result = await lookup({
        id: resourceId,
        translationIds,
        page: pageNumber,
        perPage,
        wordLang,
        tajweed,
      });
      return result.verses;
    },
    {
      // Don't use fallbackData when tajweed is true, since initial verses don't have codeV2
      ...(pageNumber === 1 && initialPageVerses && !tajweed ? { fallbackData: initialPageVerses } : {}),
    }
  );

  useEffect(() => {
    if (!versesInPage?.length) return;
    setApiPageToVersesMap((prev) =>
      prev[pageNumber] === versesInPage ? prev : { ...prev, [pageNumber]: versesInPage }
    );
  }, [pageNumber, setApiPageToVersesMap, versesInPage]);

  useEffect(() => {
    if (!error) return;
    const message = error instanceof Error ? error.message : String(error);
    onError?.(`Failed to load verses. ${message}`);
  }, [error, onError]);

  return {
    verse: versesInPage?.[idxInPage] ?? null,
    pageNumber,
    isLoading,
  };
}

