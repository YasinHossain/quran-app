'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

import { scrollTabs, updateScrollState } from '../translationPanel.utils';

export const useTabsScroll = (languages: string[]) => {
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleTabsScroll = useCallback(
    () => updateScrollState(tabsContainerRef, setCanScrollLeft, setCanScrollRight),
    []
  );

  useEffect(() => {
    handleTabsScroll();
    const container = tabsContainerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleTabsScroll);
    window.addEventListener('resize', handleTabsScroll);
    return () => {
      container.removeEventListener('scroll', handleTabsScroll);
      window.removeEventListener('resize', handleTabsScroll);
    };
  }, [languages, handleTabsScroll]);

  const scrollTabsLeft = useCallback(() => scrollTabs(tabsContainerRef, 'left'), []);
  const scrollTabsRight = useCallback(() => scrollTabs(tabsContainerRef, 'right'), []);

  return {
    tabsContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollTabsLeft,
    scrollTabsRight,
  } as const;
};

