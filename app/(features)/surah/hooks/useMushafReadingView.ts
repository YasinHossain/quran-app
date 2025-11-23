import { useMemo } from 'react';

import { DEFAULT_MUSHAF_ID } from '@/data/mushaf/options';

import { filterVersesForResource, mapVersesCollectionToPages } from './mushafReadingViewMapping';
import { useMushafPagination } from './useMushafPagination';
import { useStartPageNumber } from './useStartPageNumber';

import type {
  UseMushafReadingViewParams,
  UseMushafReadingViewResult,
} from './mushafReadingViewTypes';

export function useMushafReadingView({
  resourceId,
  resourceKind,
  mushafId,
  initialPageNumber,
  chapterId,
  juzNumber,
  initialData,
  reciterId,
  wordByWordLocale,
  translationIds,
}: UseMushafReadingViewParams): UseMushafReadingViewResult {
  const initialMappedPages = useMemo(
    () =>
      Array.isArray(initialData) && initialData.length
        ? mapVersesCollectionToPages(
            filterVersesForResource(initialData, resourceKind, chapterId, juzNumber)
          )
        : [],
    [initialData, resourceKind, chapterId, juzNumber]
  );

  const numericResourceId = Number.parseInt(resourceId, 10);
  const effectiveMushafId = mushafId ?? DEFAULT_MUSHAF_ID;
  const firstInitialPageNumber = initialMappedPages[0]?.pageNumber;

  const startPageNumber = useStartPageNumber({
    resourceKind,
    numericResourceId,
    initialPageNumber,
    firstInitialPageNumber,
    chapterId,
    juzNumber,
    mushafId: effectiveMushafId,
  });

  return useMushafPagination({
    resourceId,
    resourceKind,
    mushafId: effectiveMushafId,
    chapterId,
    juzNumber,
    initialMappedPages,
    startPageNumber,
    reciterId,
    wordByWordLocale,
    translationIds,
  });
}
