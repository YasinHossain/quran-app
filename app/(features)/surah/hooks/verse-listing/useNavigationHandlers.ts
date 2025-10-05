import { useCallback } from 'react';

import { useAudio } from '@/app/shared/player/context/AudioContext';

import type { Verse } from '@/types';

interface UseNavigationHandlersParams {
  verses: Verse[];
  activeVerse: ReturnType<typeof useAudio>['activeVerse'];
  setActiveVerse: ReturnType<typeof useAudio>['setActiveVerse'];
  openPlayer: ReturnType<typeof useAudio>['openPlayer'];
}

interface UseNavigationHandlersReturn {
  handleNext: () => boolean;
  handlePrev: () => boolean;
}

export function useNavigationHandlers({
  verses,
  activeVerse,
  setActiveVerse,
  openPlayer,
}: UseNavigationHandlersParams): UseNavigationHandlersReturn {
  const handleNext = useCallback((): boolean => {
    if (!activeVerse) return false;
    const currentIndex = verses.findIndex((v) => v.id === activeVerse.id);
    if (currentIndex < verses.length - 1) {
      setActiveVerse(verses[currentIndex + 1]!);
      openPlayer();
      return true;
    }
    return false;
  }, [activeVerse, verses, setActiveVerse, openPlayer]);

  const handlePrev = useCallback((): boolean => {
    if (!activeVerse) return false;
    const currentIndex = verses.findIndex((v) => v.id === activeVerse.id);
    if (currentIndex > 0) {
      setActiveVerse(verses[currentIndex - 1]!);
      openPlayer();
      return true;
    }
    return false;
  }, [activeVerse, verses, setActiveVerse, openPlayer]);

  return { handleNext, handlePrev } as const;
}
