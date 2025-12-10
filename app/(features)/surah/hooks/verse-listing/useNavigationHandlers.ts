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
    let nextVerse: Verse | undefined;
    setActiveVerse((prev) => {
      if (!prev) return prev;
      const currentIndex = verses.findIndex((v) => v.id === prev.id);
      if (currentIndex < verses.length - 1) {
        nextVerse = verses[currentIndex + 1]!;
        return nextVerse;
      }
      return prev;
    });
    if (nextVerse) {
      openPlayer();
      return true;
    }
    return false;
  }, [verses, setActiveVerse, openPlayer]);

  const handlePrev = useCallback((): boolean => {
    let nextVerse: Verse | undefined;
    setActiveVerse((prev) => {
      if (!prev) return prev;
      const currentIndex = verses.findIndex((v) => v.id === prev.id);
      if (currentIndex > 0) {
        nextVerse = verses[currentIndex - 1]!;
        return nextVerse;
      }
      return prev;
    });
    if (nextVerse) {
      openPlayer();
      return true;
    }
    return false;
  }, [verses, setActiveVerse, openPlayer]);

  return { handleNext, handlePrev } as const;
}
