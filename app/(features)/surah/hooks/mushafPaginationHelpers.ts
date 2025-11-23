import { useCallback, useEffect, useState } from 'react';

import type {
  LoadMoreHandler,
  LoadMoreParams,
  PaginationState,
  ResetEffectParams,
} from './mushafPaginationTypes';
import type { MushafResourceKind } from './mushafReadingViewTypes';
import type { MushafPageLines } from '@/types';

export const usePaginationState = (
  initialMappedPages: MushafPageLines[],
  resourceKind: MushafResourceKind,
  startPageNumber: number
): PaginationState => {
  const [pages, setPages] = useState(initialMappedPages);
  const [isLoading, setIsLoading] = useState(initialMappedPages.length === 0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(resourceKind !== 'page');
  const [error, setError] = useState<string | null>(null);
  const [nextPageNumber, setNextPageNumber] = useState<number | null>(() => {
    const lastInitialPageNumber = initialMappedPages[initialMappedPages.length - 1]?.pageNumber;
    return typeof lastInitialPageNumber === 'number' ? lastInitialPageNumber + 1 : startPageNumber;
  });

  return {
    pages,
    setPages,
    isLoading,
    setIsLoading,
    isLoadingMore,
    setIsLoadingMore,
    hasMore,
    setHasMore,
    error,
    setError,
    nextPageNumber,
    setNextPageNumber,
  };
};

export const usePaginationResetEffect = ({
  initialMappedPages,
  resourceId,
  resourceKind,
  startPageNumber,
  fetchPage,
  requestTokenRef,
  setPages,
  setHasMore,
  setError,
  setIsLoading,
  setIsLoadingMore,
  setNextPageNumber,
}: ResetEffectParams): void => {
  useEffect(() => {
    const token = ++requestTokenRef.current;
    const lastPageNumber = initialMappedPages[initialMappedPages.length - 1]?.pageNumber;
    setPages(initialMappedPages);
    setHasMore(resourceKind !== 'page');
    setError(null);
    setIsLoading(initialMappedPages.length === 0);
    setIsLoadingMore(false);
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
  }, [
    fetchPage,
    initialMappedPages,
    resourceId,
    resourceKind,
    startPageNumber,
    setError,
    setHasMore,
    setIsLoading,
    setIsLoadingMore,
    setNextPageNumber,
    setPages,
    requestTokenRef,
  ]);
};
export const useLoadMore = ({
  hasMore,
  isLoadingMore,
  nextPageNumber,
  fetchPage,
  requestTokenRef,
}: LoadMoreParams): LoadMoreHandler =>
  useCallback(() => {
    if (!hasMore || isLoadingMore || typeof nextPageNumber !== 'number') return;
    void fetchPage(nextPageNumber, { token: requestTokenRef.current });
  }, [fetchPage, hasMore, isLoadingMore, nextPageNumber, requestTokenRef]);
