import { useCallback, useMemo } from 'react';

import { runFetchMushafPage, type UseFetchPageParams } from './mushafPageFetchRunner';

type FetchPageCallback = (
  pageNumber: number,
  options: { isInitial?: boolean; token: number }
) => Promise<void>;

export const useFetchMushafPage = (params: UseFetchPageParams): FetchPageCallback => {
  const fetchConfig = useMemo(
    () => ({
      resourceKind: params.resourceKind,
      mushafId: params.mushafId,
      chapterId: params.chapterId,
      juzNumber: params.juzNumber,
      reciterId: params.reciterId,
      wordByWordLocale: params.wordByWordLocale,
      translationIds: params.translationIds,
      setPages: params.setPages,
      setNextPageNumber: params.setNextPageNumber,
      setHasMore: params.setHasMore,
      setError: params.setError,
      setIsLoading: params.setIsLoading,
      setIsLoadingMore: params.setIsLoadingMore,
      isRequestStale: params.isRequestStale,
    }),
    [
      params.chapterId,
      params.juzNumber,
      params.resourceKind,
      params.mushafId,
      params.reciterId,
      params.wordByWordLocale,
      params.translationIds,
      params.setPages,
      params.setNextPageNumber,
      params.setHasMore,
      params.setError,
      params.setIsLoading,
      params.setIsLoadingMore,
      params.isRequestStale,
    ]
  );

  return useCallback(
    (pageNumber: number, { isInitial = false, token }: { isInitial?: boolean; token: number }) =>
      runFetchMushafPage({ ...fetchConfig, pageNumber, isInitial, token }),
    [fetchConfig]
  );
};
