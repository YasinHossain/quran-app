import { useCallback, useRef } from 'react';

import {
  useLoadMore,
  usePaginationResetEffect,
  usePaginationState,
} from './mushafPaginationHelpers';
import { useFetchMushafPage } from './useFetchMushafPage';

import type { PaginationState } from './mushafPaginationTypes';
import type { MushafResourceKind, UseMushafReadingViewResult } from './mushafReadingViewTypes';
import type { MushafPageLines } from '@/types';

interface UseMushafPaginationParams {
  resourceId: string;
  resourceKind: MushafResourceKind;
  mushafId: string;
  chapterId?: number | null | undefined;
  juzNumber?: number | null | undefined;
  initialMappedPages: MushafPageLines[];
  startPageNumber: number;
  reciterId?: number | undefined;
  wordByWordLocale?: string | undefined;
  translationIds?: string | undefined;
}

interface FetchersParams extends UseMushafPaginationParams {
  paginationState: PaginationState;
}

interface PaginationHandlers {
  setPages: PaginationState['setPages'];
  setNextPageNumber: PaginationState['setNextPageNumber'];
  setHasMore: PaginationState['setHasMore'];
  setError: PaginationState['setError'];
  setIsLoading: PaginationState['setIsLoading'];
  setIsLoadingMore: PaginationState['setIsLoadingMore'];
}

const buildPaginationHandlers = (paginationState: PaginationState): PaginationHandlers => ({
  setPages: paginationState.setPages,
  setNextPageNumber: paginationState.setNextPageNumber,
  setHasMore: paginationState.setHasMore,
  setError: paginationState.setError,
  setIsLoading: paginationState.setIsLoading,
  setIsLoadingMore: paginationState.setIsLoadingMore,
});

const usePaginationFetchers = ({
  resourceId,
  resourceKind,
  mushafId,
  chapterId,
  juzNumber,
  initialMappedPages,
  startPageNumber,
  reciterId,
  wordByWordLocale,
  translationIds,
  paginationState,
}: FetchersParams): { loadMore: UseMushafReadingViewResult['loadMore'] } => {
  const requestTokenRef = useRef(0);
  const isRequestStale = useCallback((token: number) => requestTokenRef.current !== token, []);
  const paginationHandlers = buildPaginationHandlers(paginationState);
  const fetchPage = useFetchMushafPage({
    resourceKind,
    mushafId,
    chapterId,
    juzNumber,
    reciterId,
    wordByWordLocale,
    translationIds,
    ...paginationHandlers,
    isRequestStale,
  });

  usePaginationResetEffect({
    initialMappedPages,
    resourceId,
    resourceKind,
    startPageNumber,
    fetchPage,
    requestTokenRef,
    ...paginationHandlers,
  });

  const loadMore = useLoadMore({
    hasMore: paginationState.hasMore,
    isLoadingMore: paginationState.isLoadingMore,
    nextPageNumber: paginationState.nextPageNumber,
    fetchPage,
    requestTokenRef,
  });

  return { loadMore };
};

export const useMushafPagination = (
  params: UseMushafPaginationParams
): UseMushafReadingViewResult => {
  const paginationState = usePaginationState(
    params.initialMappedPages,
    params.resourceKind,
    params.startPageNumber
  );
  const { loadMore } = usePaginationFetchers({ ...params, paginationState });

  return {
    pages: paginationState.pages,
    isLoading: paginationState.isLoading,
    isLoadingMore: paginationState.isLoadingMore,
    hasMore: paginationState.hasMore,
    error: paginationState.error,
    loadMore,
  };
};
