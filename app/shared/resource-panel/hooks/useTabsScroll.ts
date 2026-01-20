'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseTabsScrollReturn {
  readonly tabsContainerRef: React.RefObject<HTMLDivElement | null>;
  readonly canScrollLeft: boolean;
  readonly canScrollRight: boolean;
  readonly scrollTabsLeft: () => void;
  readonly scrollTabsRight: () => void;
}

export const useTabsScroll = (languages: string[], scrollAmount = 200): UseTabsScrollReturn => {
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollState = useCallback(() => {
    if (!tabsContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  const scrollTabsLeft = useCallback(() => {
    tabsContainerRef.current?.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }, [scrollAmount]);

  const scrollTabsRight = useCallback(() => {
    tabsContainerRef.current?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }, [scrollAmount]);

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
  } as const satisfies UseTabsScrollReturn;
};
