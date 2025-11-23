import { useMemo, useRef, type RefObject } from 'react';
import { useSWRConfig } from 'swr';
import useSWRInfinite from 'swr/infinite';

import {
  buildSWRKeyFactory,
  createFetcher,
  useIntersectionLoadMore,
  usePrefetchNextPage,
  useResetPrefetchedPages,
  useScrollPrefetch,
  useTargetVersePreload,
} from './useInfiniteVerseLoader.helpers';

import type { LookupFn } from './useVerseListing';
import type { Verse } from '@/types';

interface UseInfiniteVerseLoaderParams {
  id?: string;
  lookup: LookupFn;
  stableTranslationIds: string;
  wordLang: string;
  loadMoreRef: RefObject<HTMLDivElement | null>;
  error: string | null;
  setError: (err: string) => void;
  targetVerseNumber?: number;
}

interface UseInfiniteVerseLoaderReturn {
  verses: Verse[];
  isLoading: boolean;
  isValidating: boolean;
  isReachingEnd: boolean;
}

export function useInfiniteVerseLoader({
  id,
  lookup,
  stableTranslationIds,
  wordLang,
  loadMoreRef,
  error,
  setError,
  targetVerseNumber,
}: UseInfiniteVerseLoaderParams): UseInfiniteVerseLoaderReturn {
  const { mutate: mutateGlobal } = useSWRConfig();
  const prefetchedPagesRef = useRef<Set<number>>(new Set());

  const swrKeyFactory = useMemo(
    () => buildSWRKeyFactory(id, stableTranslationIds, wordLang),
    [id, stableTranslationIds, wordLang]
  );

  const { data, size, setSize, isValidating } = useSWRInfinite(
    swrKeyFactory,
    createFetcher(lookup, setError)
  );

  const verses: Verse[] = useMemo(() => (data ? data.flatMap((d) => d.verses) : []), [data]);
  const totalPages = useMemo(() => (data ? (data[data.length - 1]?.totalPages ?? 1) : 1), [data]);
  const isLoading = !data && !error;
  const isReachingEnd = size >= totalPages;

  useResetPrefetchedPages(prefetchedPagesRef, id, stableTranslationIds, wordLang);
  useTargetVersePreload(targetVerseNumber, size, setSize, id);

  const prefetchNextPage = usePrefetchNextPage({
    id,
    keyFactory: swrKeyFactory,
    isReachingEnd,
    mutateGlobal,
    lookup,
    size,
    prefetchedPagesRef,
  });

  useIntersectionLoadMore({
    loadMoreRef,
    isReachingEnd,
    isValidating,
    setSize,
    verseCount: verses.length,
  });
  useScrollPrefetch(loadMoreRef, prefetchNextPage, verses.length);

  return { verses, isLoading, isValidating, isReachingEnd } as const;
}
