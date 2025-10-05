import { useEffect, useMemo } from 'react';
import useSWRInfinite from 'swr/infinite';

import type { LookupFn } from './useVerseListing';
import type { Verse } from '@/types';

interface UseInfiniteVerseLoaderParams {
  id?: string;
  lookup: LookupFn;
  stableTranslationIds: string;
  wordLang: string;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  error: string | null;
  setError: (err: string) => void;
}

interface UseInfiniteVerseLoaderReturn {
  verses: Verse[];
  isLoading: boolean;
  isValidating: boolean;
  isReachingEnd: boolean;
}

function createSWRKey(id?: string, stableTranslationIds?: string, wordLang?: string) {
  return (index: number) => (id ? ['verses', id, stableTranslationIds, wordLang, index + 1] : null);
}

function createFetcher(lookup: LookupFn, setError: (msg: string) => void) {
  return ([, pId, translationIdsStr, wl, page]: [string, string, string, string, number]) => {
    const translationIds = translationIdsStr.split(',').map(Number);
    return lookup({
      id: pId as string,
      translationIds,
      page: page as number,
      perPage: 20,
      wordLang: wl as string,
    }).catch((err) => {
      setError(`Failed to load content. ${err.message}`);
      return { verses: [], totalPages: 1 };
    });
  };
}

function findScrollRoot(start: HTMLElement | null): Element | null {
  let node: HTMLElement | null = start?.parentElement ?? null;
  while (node && getComputedStyle(node).overflowY !== 'auto') {
    node = node.parentElement;
  }
  return node;
}

export function useInfiniteVerseLoader({
  id,
  lookup,
  stableTranslationIds,
  wordLang,
  loadMoreRef,
  error,
  setError,
}: UseInfiniteVerseLoaderParams): UseInfiniteVerseLoaderReturn {
  const { data, size, setSize, isValidating } = useSWRInfinite(
    createSWRKey(id, stableTranslationIds, wordLang),
    createFetcher(lookup, setError)
  );

  const verses: Verse[] = useMemo(() => (data ? data.flatMap((d) => d.verses) : []), [data]);
  const totalPages = useMemo(() => (data ? (data[data.length - 1]?.totalPages ?? 1) : 1), [data]);
  const isLoading = !data && !error;
  const isReachingEnd = size >= totalPages;

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const scrollRoot = findScrollRoot(loadMoreRef.current);
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first && first.isIntersecting && !isReachingEnd && !isValidating) {
          setSize(size + 1);
        }
      },
      { root: scrollRoot, rootMargin: '100px', threshold: 0.1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [isReachingEnd, isValidating, size, setSize, loadMoreRef]);

  return { verses, isLoading, isValidating, isReachingEnd } as const;
}
