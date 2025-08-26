import { useEffect, useMemo } from 'react';
import useSWRInfinite from 'swr/infinite';
import type { Verse } from '@/types';
import type { LookupFn } from './useVerseListing';

interface UseInfiniteVerseLoaderParams {
  id?: string;
  lookup: LookupFn;
  stableTranslationIds: string;
  wordLang: string;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  error: string | null;
  setError: (err: string) => void;
}

export function useInfiniteVerseLoader({
  id,
  lookup,
  stableTranslationIds,
  wordLang,
  loadMoreRef,
  error,
  setError,
}: UseInfiniteVerseLoaderParams) {
  const { data, size, setSize, isValidating } = useSWRInfinite(
    (index) => (id ? ['verses', id, stableTranslationIds, wordLang, index + 1] : null),
    ([, pId, translationIdsStr, wl, page]) => {
      const translationIds = translationIdsStr.split(',').map(Number);
      return lookup(pId, translationIds, page, 20, wl).catch((err) => {
        setError(`Failed to load content. ${err.message}`);
        return { verses: [], totalPages: 1 };
      });
    }
  );

  const verses: Verse[] = useMemo(() => (data ? data.flatMap((d) => d.verses) : []), [data]);
  const totalPages = useMemo(() => (data ? data[data.length - 1]?.totalPages : 1), [data]);
  const isLoading = !data && !error;
  const isReachingEnd = size >= totalPages;

  useEffect(() => {
    if (!loadMoreRef.current) return;

    // Find the closest scrollable ancestor
    let scrollRoot = loadMoreRef.current.parentElement;
    while (scrollRoot && getComputedStyle(scrollRoot).overflowY !== 'auto') {
      scrollRoot = scrollRoot.parentElement;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isReachingEnd && !isValidating) {
          setSize(size + 1);
        }
      },
      {
        root: scrollRoot, // Use the scroll container as root
        rootMargin: '100px',
        threshold: 0.1,
      }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [isReachingEnd, isValidating, size, setSize, loadMoreRef]);

  return { verses, isLoading, isValidating, isReachingEnd } as const;
}

export default useInfiniteVerseLoader;
