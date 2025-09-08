import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { useCoverAndTrack } from '@/app/shared/hooks/useCoverAndTrack';

import type { useJuzData } from './useJuzData';
import type { Track } from '@/app/shared/player/types';

type PlayerBarProps = {
  readonly isHidden: boolean;
  readonly track: Track | null;
  readonly activeVerseExists: boolean;
  readonly isPlayerVisible: boolean;
  readonly onNext: () => void;
  readonly onPrev: () => void;
};

type UseJuzPlayerBarPropsReturn = {
  readonly isHidden: boolean;
  readonly playerBarProps: PlayerBarProps;
};

function buildPlayerBarProps(
  isHidden: boolean,
  track: Track | null,
  activeVerse: ReturnType<typeof useJuzData>['activeVerse'],
  isPlayerVisible: boolean,
  onNext: () => void,
  onPrev: () => void
): PlayerBarProps {
  return {
    isHidden,
    track,
    activeVerseExists: !!activeVerse,
    isPlayerVisible,
    onNext,
    onPrev,
  };
}

export function useJuzPlayerBarProps(
  args: Pick<
    ReturnType<typeof useJuzData>,
    'activeVerse' | 'reciter' | 'isPlayerVisible' | 'handleNext' | 'handlePrev'
  >
): UseJuzPlayerBarPropsReturn {
  const { activeVerse, reciter, isPlayerVisible, handleNext, handlePrev } = args;

  const { isHidden } = useHeaderVisibility();
  const { track } = useCoverAndTrack(activeVerse, reciter);

  const playerBarProps = buildPlayerBarProps(
    isHidden,
    track,
    activeVerse,
    isPlayerVisible,
    handleNext,
    handlePrev
  );

  return { isHidden, playerBarProps };
}
