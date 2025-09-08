import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { useCoverAndTrack } from '@/app/shared/hooks/useCoverAndTrack';

import type { useJuzData } from './useJuzData';

export function useJuzPlayerBarProps(
  args: Pick<
    ReturnType<typeof useJuzData>,
    'activeVerse' | 'reciter' | 'isPlayerVisible' | 'handleNext' | 'handlePrev'
  >
) {
  const { activeVerse, reciter, isPlayerVisible, handleNext, handlePrev } = args;

  const { isHidden } = useHeaderVisibility();
  const { track } = useCoverAndTrack(activeVerse, reciter);

  const playerBarProps = {
    isHidden,
    track,
    activeVerseExists: !!activeVerse,
    isPlayerVisible,
    onNext: handleNext,
    onPrev: handlePrev,
  } as const;

  return { isHidden, playerBarProps } as const;
}
