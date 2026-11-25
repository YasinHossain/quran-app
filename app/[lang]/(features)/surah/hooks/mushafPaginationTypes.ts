import type { MushafResourceKind, UseMushafReadingViewResult } from './mushafReadingViewTypes';
import type { MushafPageLines } from '@/types';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';

export interface PaginationState {
  pages: MushafPageLines[];
  setPages: Dispatch<SetStateAction<MushafPageLines[]>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isLoadingMore: boolean;
  setIsLoadingMore: Dispatch<SetStateAction<boolean>>;
  hasMore: boolean;
  setHasMore: Dispatch<SetStateAction<boolean>>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  nextPageNumber: number | null;
  setNextPageNumber: Dispatch<SetStateAction<number | null>>;
}

export interface ResetEffectParams {
  initialMappedPages: MushafPageLines[];
  resourceId: string;
  resourceKind: MushafResourceKind;
  startPageNumber: number;
  fetchPage: (pageNumber: number, options: { isInitial?: boolean; token: number }) => void;
  requestTokenRef: MutableRefObject<number>;
  setPages: Dispatch<SetStateAction<MushafPageLines[]>>;
  setHasMore: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsLoadingMore: Dispatch<SetStateAction<boolean>>;
  setNextPageNumber: Dispatch<SetStateAction<number | null>>;
}

export interface LoadMoreParams {
  hasMore: boolean;
  isLoadingMore: boolean;
  nextPageNumber: number | null;
  fetchPage: (pageNumber: number, options: { token: number }) => void;
  requestTokenRef: MutableRefObject<number>;
}

export type LoadMoreHandler = UseMushafReadingViewResult['loadMore'];
