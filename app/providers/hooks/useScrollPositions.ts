'use client';

import { useCallback, useMemo, useState } from 'react';

interface UseScrollPositionsReturn {
  scrollPositions: Record<string, number>;
  setScrollPosition: (key: string, position: number) => void;
  getScrollPosition: (key: string) => number;
}

export const useScrollPositions = (): UseScrollPositionsReturn => {
  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>(() => {
    if (typeof window === 'undefined') return {};
    const stored = sessionStorage.getItem('uiScrollPositions');
    return stored ? JSON.parse(stored) : {};
  });

  const setScrollPosition = useCallback((key: string, position: number) => {
    setScrollPositions((prev) => {
      const next = { ...prev, [key]: position };
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('uiScrollPositions', JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const getScrollPosition = useCallback(
    (key: string) => scrollPositions[key] || 0,
    [scrollPositions]
  );

  return useMemo(
    () => ({ scrollPositions, setScrollPosition, getScrollPosition }),
    [scrollPositions, setScrollPosition, getScrollPosition]
  );
};
