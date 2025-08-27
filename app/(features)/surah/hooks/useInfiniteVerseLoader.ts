import { useEffect, useMemo, useRef, useState } from 'react';
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
  const MAX_PAGES = 50;
  const isReachingEnd = size >= totalPages || size >= MAX_PAGES;
  const [needsManualLoad, setNeedsManualLoad] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current || isReachingEnd) return;

    // Add safety check for development environment
    if (process.env.NODE_ENV === 'development' && verses.length > 100) {
      console.warn('Stopping infinite loading in development to prevent memory issues');
      return;
    }

    // Find the closest scrollable ancestor with improved safety
    let scrollRoot = loadMoreRef.current.parentElement;
    let depth = 0;
    const maxDepth = 10; // Prevent infinite traversal

    while (scrollRoot && depth < maxDepth) {
      const style = getComputedStyle(scrollRoot);
      if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
        break;
      }
      scrollRoot = scrollRoot.parentElement;
      depth++;
    }

    // Fallback to viewport if no scroll container found
    if (depth >= maxDepth) {
      scrollRoot = null;
    }

    const targetElement = loadMoreRef.current;

    const isOutsideViewport = () => {
      const rect = targetElement.getBoundingClientRect();
      const viewportBottom = scrollRoot
        ? (scrollRoot as Element).getBoundingClientRect().bottom
        : window.innerHeight;
      return rect.top > viewportBottom;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting && !isReachingEnd && !isValidating) {
          observer.unobserve(targetElement);
          setSize((prev) => prev + 1).finally(() => {
            if (loadMoreRef.current && !isReachingEnd) {
              if (isOutsideViewport()) {
                setNeedsManualLoad(false);
                observer.observe(loadMoreRef.current);
              } else {
                setNeedsManualLoad(true);
              }
            }
          });
        }
      },
      {
        root: scrollRoot,
        rootMargin: '200px', // Increased margin for better UX
        threshold: 0.1,
      }
    );

    observerRef.current = observer;

    if (isOutsideViewport()) {
      observer.observe(targetElement);
    } else {
      setNeedsManualLoad(true);
    }

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [isReachingEnd, isValidating, verses.length]); // Removed size dependency to prevent excessive re-renders

  const loadMore = () => {
    if (isReachingEnd || isValidating) return;
    setNeedsManualLoad(false);
    setSize((prev) => prev + 1).finally(() => {
      if (loadMoreRef.current && observerRef.current && !isReachingEnd) {
        const targetElement = loadMoreRef.current;
        const rect = targetElement.getBoundingClientRect();
        const viewportBottom =
          observerRef.current.root instanceof Element
            ? observerRef.current.root.getBoundingClientRect().bottom
            : window.innerHeight;
        if (rect.top > viewportBottom) {
          observerRef.current.observe(targetElement);
        } else {
          setNeedsManualLoad(true);
        }
      }
    });
  };

  return { verses, isLoading, isValidating, isReachingEnd, loadMore, needsManualLoad } as const;
}

export default useInfiniteVerseLoader;
