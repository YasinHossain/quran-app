import { useEffect, type MutableRefObject, type RefObject } from 'react';

import type { SetSize } from './useInfiniteVerseLoader.fetcher';

export const PREFETCH_SCROLL_THRESHOLD_PX = 800;

const findScrollRoot = (start: HTMLElement | null): Element | null => {
  let node: HTMLElement | null = start?.parentElement ?? null;
  while (node && getComputedStyle(node).overflowY !== 'auto') {
    node = node.parentElement;
  }
  return node;
};

export const useResetPrefetchedPages = (
  prefetchedPagesRef: MutableRefObject<Set<number>>,
  id?: string,
  stableTranslationIds?: string,
  wordLang?: string
): void => {
  useEffect(() => {
    prefetchedPagesRef.current.clear();
  }, [prefetchedPagesRef, id, stableTranslationIds, wordLang]);
};

interface LoadMoreParams {
  loadMoreRef: RefObject<HTMLDivElement | null>;
  isReachingEnd: boolean;
  isValidating: boolean;
  setSize: SetSize;
  verseCount: number;
}

export const useIntersectionLoadMore = ({
  loadMoreRef,
  isReachingEnd,
  isValidating,
  setSize,
  verseCount,
}: LoadMoreParams): void => {
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
  }, [isReachingEnd, isValidating, setSize, loadMoreRef, verseCount]);
};

export const useScrollPrefetch = (
  loadMoreRef: RefObject<HTMLDivElement | null>,
  prefetchNextPage: () => void,
  verseCount: number
): void => {
  useEffect(() => {
    const loadMoreTarget = loadMoreRef.current;
    if (!loadMoreTarget) return;

    const scrollRoot = findScrollRoot(loadMoreTarget);
    if (!(scrollRoot instanceof HTMLElement)) return;

    const handleScroll = (): void => {
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
  }, [prefetchNextPage, loadMoreRef, verseCount]);
};
