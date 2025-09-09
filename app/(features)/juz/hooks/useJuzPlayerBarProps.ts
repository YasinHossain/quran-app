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

interface BuildPlayerBarPropsArgs {
  readonly isHidden: boolean;
  readonly track: Track | null;
  readonly activeVerse: ReturnType<typeof useJuzData>['activeVerse'];
  readonly isPlayerVisible: boolean;
  readonly onNext: () => void;
  readonly onPrev: () => void;
}

type UseJuzPlayerBarPropsReturn = {
  readonly isHidden: boolean;
  readonly playerBarProps: PlayerBarProps;
};

function buildPlayerBarProps({
  isHidden,
  track,
  activeVerse,
  isPlayerVisible,
  onNext,
  onPrev,
}: BuildPlayerBarPropsArgs): PlayerBarProps {
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

  const playerBarProps = buildPlayerBarProps({
    isHidden,
    track,
    activeVerse,
    isPlayerVisible,
    onNext: handleNext,
    onPrev: handlePrev,
  });

  return { isHidden, playerBarProps };
}
