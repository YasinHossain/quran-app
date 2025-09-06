'use client';

import { useEffect } from 'react';

import type { Verse } from '@/types';

interface UseVerseTransitionProps {
  verse: Verse | null;
  initialLoad: boolean;
  setInitialLoad: (value: boolean) => void;
  setIsTransitioning: (value: boolean) => void;
  setDisplayVerse: (verse: Verse | null) => void;
}

export function useVerseTransition({
  verse,
  initialLoad,
  setInitialLoad,
  setIsTransitioning,
  setDisplayVerse,
}: UseVerseTransitionProps): void {
  useEffect(() => {
    if (!verse) return;

    if (initialLoad) {
      setDisplayVerse(verse);
      setInitialLoad(false);
      return;
    }

    setIsTransitioning(true);

    const timer = setTimeout(() => {
      setDisplayVerse(verse);
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [verse, initialLoad, setInitialLoad, setIsTransitioning, setDisplayVerse]);
}
