import { getReadingViewPage } from '@infra/quran/readingViewClient';

import {
  filterVersesForResource,
  insertPageSorted,
  mapVersesToPage,
} from './mushafReadingViewMapping';

import type { MushafResourceKind } from './mushafReadingViewTypes';
import type { MushafPageLines, MushafVerse } from '@/types';
const GENERIC_ERROR_MESSAGE = 'Failed to load Mushaf data.';

export interface UseFetchPageParams {
  resourceKind: MushafResourceKind;
  mushafId: string;
  chapterId?: number | null;
  juzNumber?: number | null;
  reciterId?: number;
  wordByWordLocale?: string;
  translationIds?: string;
  setPages: React.Dispatch<React.SetStateAction<MushafPageLines[]>>;
  setNextPageNumber: React.Dispatch<React.SetStateAction<number | null>>;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoadingMore: React.Dispatch<React.SetStateAction<boolean>>;
  isRequestStale: (token: number) => boolean;
}
export interface FetchRuntimeParams extends UseFetchPageParams {
  pageNumber: number;
  isInitial: boolean;
  token: number;
}

const markLoading = (handlers: UseFetchPageParams, isInitial: boolean): void => {
  if (isInitial) {
    handlers.setIsLoading(true);
  } else {
    handlers.setIsLoadingMore(true);
  }
  handlers.setError(null);
};

const handleEmptyPage = (handlers: UseFetchPageParams, isInitial: boolean): void => {
  handlers.setHasMore(false);
  handlers.setNextPageNumber(null);
  if (isInitial) {
    handlers.setPages([]);
  }
};

const applyPageResult = (
  handlers: UseFetchPageParams,
  pageNumber: number,
  filtered: MushafVerse[]
): void => {
  const mappedPage = mapVersesToPage(pageNumber, filtered);
  handlers.setPages((current) => insertPageSorted(current, mappedPage));
  handlers.setNextPageNumber(handlers.resourceKind === 'page' ? null : pageNumber + 1);
  if (handlers.resourceKind === 'page') {
    handlers.setHasMore(false);
  }
};

const handleFetchError = (handlers: UseFetchPageParams, err: unknown, isInitial: boolean): void => {
  const message = err instanceof Error ? err.message : null;
  if (typeof message === 'string' && message.includes('404')) {
    handleEmptyPage(handlers, isInitial);
    return;
  }
  handlers.setError(message ?? GENERIC_ERROR_MESSAGE);
};

const finalizeRequest = (handlers: UseFetchPageParams, isInitial: boolean): void => {
  if (isInitial) {
    handlers.setIsLoading(false);
  } else {
    handlers.setIsLoadingMore(false);
  }
};

// eslint-disable-next-line complexity
export const runFetchMushafPage = async (params: FetchRuntimeParams): Promise<void> => {
  if (!Number.isFinite(params.pageNumber) || params.pageNumber <= 0) return;

  markLoading(params, params.isInitial);
  let isStale = false;

  try {
    const verses = await getReadingViewPage({
      pageNumber: params.pageNumber,
      mushafId: params.mushafId,
      ...(typeof params.reciterId === 'number' ? { reciterId: params.reciterId } : {}),
      ...(params.wordByWordLocale ? { wordByWordLocale: params.wordByWordLocale } : {}),
      ...(params.translationIds ? { translationIds: params.translationIds } : {}),
    });
    isStale = params.isRequestStale(params.token);
    if (isStale) return;

    const filtered = filterVersesForResource(
      verses,
      params.resourceKind,
      params.chapterId,
      params.juzNumber
    );
    if (!filtered.length) {
      handleEmptyPage(params, params.isInitial);
      return;
    }
    applyPageResult(params, params.pageNumber, filtered);
  } catch (err) {
    isStale = params.isRequestStale(params.token);
    if (isStale) return;
    handleFetchError(params, err, params.isInitial);
  } finally {
    if (!isStale) {
      finalizeRequest(params, params.isInitial);
    }
  }
};
