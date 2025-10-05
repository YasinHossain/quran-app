import { useAudioControllerCore } from './useAudioControllerCore';
import { usePlayerLayout } from './usePlayerLayout';
import { usePlayerOptionsState } from './usePlayerOptionsState';

interface Options {
  core: ReturnType<typeof useAudioControllerCore>;
  setMobileOptionsOpen: ReturnType<typeof usePlayerOptionsState>['setMobileOptionsOpen'];
  onPrev?: () => boolean;
  onNext?: () => boolean;
}

export function useControllerLayout({
  core,
  setMobileOptionsOpen,
  onPrev,
  onNext,
}: Options): ReturnType<typeof usePlayerLayout> {
  return usePlayerLayout({
    timing: core.timing,
    isPlaying: core.isPlaying,
    ...(onNext ? { onNext } : {}),
    ...(onPrev ? { onPrev } : {}),
    closePlayer: core.closePlayer,
    setMobileOptionsOpen,
    controls: core.controls,
  });
}
