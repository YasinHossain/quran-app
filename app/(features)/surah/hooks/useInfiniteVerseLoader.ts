import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSWRConfig } from 'swr';
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
  targetVerseNumber?: number;
}

interface UseInfiniteVerseLoaderReturn {
  verses: Verse[];
  isLoading: boolean;
  isValidating: boolean;
  isReachingEnd: boolean;
}

const PREFETCH_SCROLL_THRESHOLD_PX = 800;
const VERSES_PER_PAGE = 20;

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
      perPage: VERSES_PER_PAGE,
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
  targetVerseNumber,
}: UseInfiniteVerseLoaderParams): UseInfiniteVerseLoaderReturn {
  const { mutate: mutateGlobal } = useSWRConfig();
  const prefetchedPagesRef = useRef<Set<number>>(new Set());

  const { data, size, setSize, isValidating } = useSWRInfinite(
    createSWRKey(id, stableTranslationIds, wordLang),
    createFetcher(lookup, setError)
  );

  const verses: Verse[] = useMemo(() => (data ? data.flatMap((d) => d.verses) : []), [data]);
  const totalPages = useMemo(() => (data ? (data[data.length - 1]?.totalPages ?? 1) : 1), [data]);
  const isLoading = !data && !error;
  const isReachingEnd = size >= totalPages;

  const keyFactory = useMemo(
    () => createSWRKey(id, stableTranslationIds, wordLang),
    [id, stableTranslationIds, wordLang]
  );

  useEffect(() => {
    prefetchedPagesRef.current.clear();
  }, [id, stableTranslationIds, wordLang]);

  useEffect(() => {
    if (!targetVerseNumber || targetVerseNumber <= 0) {
      return;
    }
    const requiredPages = Math.max(1, Math.ceil(targetVerseNumber / VERSES_PER_PAGE));
    if (requiredPages > size) {
      setSize(requiredPages);
    }
  }, [targetVerseNumber, size, setSize, id]);

  const prefetchNextPage = useCallback(() => {
    if (!id || !keyFactory) return;
    const nextPageIndex = size;
    if (isReachingEnd || prefetchedPagesRef.current.has(nextPageIndex)) return;

    const nextKey = keyFactory(nextPageIndex);
    if (!nextKey) return;

    const [, chapterId, translationIdsValue, wl, page] = nextKey;
    if (
      typeof chapterId !== 'string' ||
      typeof translationIdsValue !== 'string' ||
      typeof wl !== 'string' ||
      typeof page !== 'number'
    ) {
      return;
    }

    const parsedTranslationIds = translationIdsValue
      .split(',')
      .filter((value) => value.length > 0)
      .map((value) => Number(value));

    prefetchedPagesRef.current.add(nextPageIndex);

    void mutateGlobal(
      nextKey,
      () =>
        lookup({
          id: chapterId,
          translationIds: parsedTranslationIds,
          page,
          perPage: VERSES_PER_PAGE,
          wordLang: wl,
        }).catch((err) => {
          prefetchedPagesRef.current.delete(nextPageIndex);
          throw err;
        }),
      { populateCache: true, revalidate: false }
    ).catch(() => {});
  }, [id, keyFactory, isReachingEnd, mutateGlobal, lookup, size]);

  useEffect(() => {
    const loadMoreTarget = loadMoreRef.current;
    if (!loadMoreTarget) return;

    const scrollRoot = findScrollRoot(loadMoreTarget);
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first && first.isIntersecting && !isReachingEnd && !isValidating) {
          setSize((previous) => previous + 1);
        }
      },
      { root: scrollRoot, rootMargin: '100px', threshold: 0.1 }
    );

    observer.observe(loadMoreTarget);
    return () => {
      observer.disconnect();
    };
  }, [isReachingEnd, isValidating, setSize, loadMoreRef, verses.length]);

  useEffect(() => {
    const loadMoreTarget = loadMoreRef.current;
    if (!loadMoreTarget) return;

    const scrollRoot = findScrollRoot(loadMoreTarget);
    if (!(scrollRoot instanceof HTMLElement)) return;

    const handleScroll = () => {
      const remaining = scrollRoot.scrollHeight - (scrollRoot.scrollTop + scrollRoot.clientHeight);
      if (remaining <= PREFETCH_SCROLL_THRESHOLD_PX) {
        prefetchNextPage();
      }
    };

    scrollRoot.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      scrollRoot.removeEventListener('scroll', handleScroll);
    };
  }, [prefetchNextPage, loadMoreRef, verses.length]);

  return { verses, isLoading, isValidating, isReachingEnd } as const;
}
