import { memo } from 'react';
import { SkipBackIcon, SkipForwardIcon, PlayIcon, PauseIcon } from '@/app/shared/icons';
import { Button } from '@/app/shared/ui/Button';
import { iconClasses } from '@/lib/responsive';

interface Props {
  isPlaying: boolean;
  interactable: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  togglePlay: () => void;
}

/**
 * Displays play/pause and skip controls for audio transport.
 */
export const TransportControls = memo(function TransportControls({
  isPlaying,
  interactable,
  onPrev,
  onNext,
  togglePlay,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="icon-round"
        size="icon-round"
        aria-label="Previous track"
        onClick={onPrev}
        disabled={!interactable}
      >
        <SkipBackIcon className={`${iconClasses.touch} ${iconClasses.stroke}`} />
      </Button>
      <Button
        variant="primary"
        size="icon-round"
        aria-label={isPlaying ? 'Pause' : 'Play'}
        onClick={togglePlay}
        disabled={!interactable}
        className="h-10 w-10"
      >
        {isPlaying ? (
          <PauseIcon className={iconClasses.touch} />
        ) : (
          <PlayIcon className={iconClasses.touch} />
        )}
      </Button>
      <Button
        variant="icon-round"
        size="icon-round"
        aria-label="Next track"
        onClick={onNext}
        disabled={!interactable}
      >
        <SkipForwardIcon className={`${iconClasses.touch} ${iconClasses.stroke}`} />
      </Button>
    </div>
  );
});
