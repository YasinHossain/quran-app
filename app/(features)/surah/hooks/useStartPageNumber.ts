import { useCallback, useEffect, useRef, useState } from 'react';

import { useResolvedStartPageEffect } from './startPageResolution';

import type { MushafResourceKind } from './mushafReadingViewTypes';

const DEFAULT_PAGE_NUMBER = 1;

interface UseStartPageNumberParams {
  resourceKind: MushafResourceKind;
  numericResourceId: number;
  initialPageNumber?: number | undefined;
  firstInitialPageNumber?: number | undefined;
  chapterId?: number | null | undefined;
  juzNumber?: number | null | undefined;
  mushafId: string;
}

export const useStartPageNumber = ({
  resourceKind,
  numericResourceId,
  initialPageNumber,
  firstInitialPageNumber,
  chapterId,
  juzNumber,
  mushafId,
}: UseStartPageNumberParams): number => {
  const resolveBaseStartPageNumber = useCallback(() => {
    if (resourceKind === 'page' && Number.isFinite(numericResourceId)) {
      return numericResourceId;
    }
    if (typeof initialPageNumber === 'number' && initialPageNumber > 0) {
      return initialPageNumber;
    }
    if (typeof firstInitialPageNumber === 'number' && firstInitialPageNumber > 0) {
      return firstInitialPageNumber;
    }
    return DEFAULT_PAGE_NUMBER;
  }, [resourceKind, numericResourceId, initialPageNumber, firstInitialPageNumber]);

  const [startPageNumber, setStartPageNumber] = useState<number>(() =>
    resolveBaseStartPageNumber()
  );
  const startPageResolveTokenRef = useRef(0);

  useEffect(() => {
    setStartPageNumber(resolveBaseStartPageNumber());
  }, [resolveBaseStartPageNumber]);

  useResolvedStartPageEffect({
    resourceKind,
    mushafId,
    chapterId,
    juzNumber,
    resolveBaseStartPageNumber,
    startPageResolveTokenRef,
    setStartPageNumber,
  });

  return startPageNumber;
};
