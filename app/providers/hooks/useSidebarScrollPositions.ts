'use client';

import { useCallback, useMemo } from 'react';

import { useScrollPositions } from './useScrollPositions';

interface UseSidebarScrollPositionsReturn {
  surahScrollTop: number;
  setSurahScrollTop: (top: number) => void;
  juzScrollTop: number;
  setJuzScrollTop: (top: number) => void;
  pageScrollTop: number;
  setPageScrollTop: (top: number) => void;
}

export const useSidebarScrollPositions = (): UseSidebarScrollPositionsReturn => {
  const { getScrollPosition, setScrollPosition } = useScrollPositions();

  const surahScrollTop = getScrollPosition('surahScrollTop');
  const setSurahScrollTop = useCallback(
    (top: number) => setScrollPosition('surahScrollTop', top),
    [setScrollPosition]
  );

  const juzScrollTop = getScrollPosition('juzScrollTop');
  const setJuzScrollTop = useCallback(
    (top: number) => setScrollPosition('juzScrollTop', top),
    [setScrollPosition]
  );

  const pageScrollTop = getScrollPosition('pageScrollTop');
  const setPageScrollTop = useCallback(
    (top: number) => setScrollPosition('pageScrollTop', top),
    [setScrollPosition]
  );

  return useMemo(
    () => ({
      surahScrollTop,
      setSurahScrollTop,
      juzScrollTop,
      setJuzScrollTop,
      pageScrollTop,
      setPageScrollTop,
    }),
    [
      surahScrollTop,
      setSurahScrollTop,
      juzScrollTop,
      setJuzScrollTop,
      pageScrollTop,
      setPageScrollTop,
    ]
  );
};
