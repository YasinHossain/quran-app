'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseTafsirTabsScrollReturn {
  readonly tabsContainerRef: React.RefObject<HTMLDivElement | null>;
  readonly canScrollLeft: boolean;
  readonly canScrollRight: boolean;
  readonly scrollTabsLeft: () => void;
  readonly scrollTabsRight: () => void;
}

export const useTafsirTabsScroll = (languages: string[]): UseTafsirTabsScrollReturn => {
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollState = useCallback(() => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  const scrollTabsLeft = useCallback(() => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  }, []);

  const scrollTabsRight = useCallback(() => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    checkScrollState();
    const container = tabsContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollState);
      window.addEventListener('resize', checkScrollState);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollState);
      }
      window.removeEventListener('resize', checkScrollState);
    };
  }, [languages, checkScrollState]);

  return {
    tabsContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollTabsLeft,
    scrollTabsRight,
  } as const satisfies UseTafsirTabsScrollReturn;
};
