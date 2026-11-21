'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseTabsScrollReturn {
  readonly tabsContainerRef: React.RefObject<HTMLDivElement | null>;
  readonly canScrollLeft: boolean;
  readonly canScrollRight: boolean;
  readonly scrollTabsLeft: () => void;
  readonly scrollTabsRight: () => void;
}

interface ScrollMetrics {
  readonly scrollLeft: number;
  readonly scrollWidth: number;
  readonly clientWidth: number;
  readonly isRtl: boolean;
}

/**
 * Which physical directions still have hidden tabs. In RTL containers browsers
 * report `scrollLeft` as 0 at the start (right edge) and negative toward the left.
 */
export const getPhysicalScrollState = ({
  scrollLeft,
  scrollWidth,
  clientWidth,
  isRtl,
}: ScrollMetrics): { canScrollLeft: boolean; canScrollRight: boolean } => {
  const maxScroll = Math.max(0, scrollWidth - clientWidth);
  const distanceFromLeft = isRtl ? maxScroll + scrollLeft : scrollLeft;
  return {
    canScrollLeft: distanceFromLeft > 1,
    canScrollRight: distanceFromLeft < maxScroll - 1,
  };
};

export const useTabsScroll = (languages: string[], scrollAmount = 200): UseTabsScrollReturn => {
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollState = useCallback(() => {
    if (!tabsContainerRef.current) return;
    const container = tabsContainerRef.current;
    const { canScrollLeft: left, canScrollRight: right } = getPhysicalScrollState({
      scrollLeft: container.scrollLeft,
      scrollWidth: container.scrollWidth,
      clientWidth: container.clientWidth,
      isRtl: getComputedStyle(container).direction === 'rtl',
    });
    setCanScrollLeft(left);
    setCanScrollRight(right);
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
