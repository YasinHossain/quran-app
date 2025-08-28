import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

  // Use refs to avoid dependency issues
  const isReachingEndRef = useRef(isReachingEnd);
  const isValidatingRef = useRef(isValidating);

  // Update refs when values change
  useEffect(() => {
    isReachingEndRef.current = isReachingEnd;
    isValidatingRef.current = isValidating;
  }, [isReachingEnd, isValidating]);

  // Memoize the intersection handler to prevent unnecessary re-creates
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry && entry.isIntersecting && !isReachingEndRef.current && !isValidatingRef.current) {
        const observer = observerRef.current;
        if (observer) {
          observer.unobserve(entry.target);
          setSize((prev) => prev + 1);
        }
      }
    },
    [setSize]
  );

  useEffect(() => {
    const currentElement = loadMoreRef.current;

    if (!currentElement || isReachingEnd) {
      // Clean up existing observer if conditions no longer met
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    // Add safety check for development environment
    if (process.env.NODE_ENV !== 'production' && verses.length > 100) {
      console.warn('Stopping infinite loading in development to prevent memory issues');
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    // Prevent multiple observers
    if (observerRef.current) {
      return;
    }

    // Find the closest scrollable ancestor with improved safety
    let scrollRoot = currentElement.parentElement;
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

    const observer = new IntersectionObserver(handleIntersection, {
      root: scrollRoot,
      rootMargin: process.env.NODE_ENV !== 'production' ? '50px' : '200px',
      threshold: 0.1,
    });

    observerRef.current = observer;
    observer.observe(currentElement);

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [handleIntersection, isReachingEnd, verses.length]); // Only essential dependencies

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
