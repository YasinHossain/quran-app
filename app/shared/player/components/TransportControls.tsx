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
  className?: string; // Allow overriding layout
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
  className,
}: Props) {
  return (
    <div className={className || "flex items-center gap-1 xs:gap-2"}>
      <Button
        variant="icon-round"
        size="icon-round"
        aria-label="Previous track"
        onClick={onPrev}
        disabled={!interactable}
        className="h-8 w-8 min-h-8 min-w-8 xs:min-h-touch xs:min-w-touch xs:h-9 xs:w-9"
      >
        <SkipBackIcon className={`${iconClasses.touch} ${iconClasses.stroke}`} />
      </Button>
      <Button
        variant="primary"
        size="icon-round"
        aria-label={isPlaying ? 'Pause' : 'Play'}
        onClick={togglePlay}
        disabled={!interactable}
        className="h-8 w-8 min-h-8 min-w-8 rounded-full sm:h-10 sm:w-10 sm:min-h-10 sm:min-w-10"
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
        className="h-8 w-8 min-h-8 min-w-8 xs:min-h-touch xs:min-w-touch xs:h-9 xs:w-9"
      >
        <SkipForwardIcon className={`${iconClasses.touch} ${iconClasses.stroke}`} />
      </Button>
    </div>
  );
});
