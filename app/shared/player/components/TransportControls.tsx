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
    <div className={className || 'flex items-center gap-1 xs:gap-2'}>
      <Button
        variant="icon-round"
        size="icon-round"
        aria-label="Previous track"
        onClick={onPrev}
        disabled={!interactable}
        className="!h-9 !w-9 !min-h-9 !min-w-9 hover:bg-transparent hover:text-foreground hover:translate-y-0 [@media(hover:hover)]:hover:bg-interactive-hover [@media(hover:hover)]:hover:text-accent [@media(hover:hover)]:hover:-translate-y-px active:ring-2 active:ring-accent/35 active:text-accent transition-none"
      >
        <SkipBackIcon className={`${iconClasses.touch} ${iconClasses.stroke}`} />
      </Button>
      <Button
        variant="primary"
        size="icon-round"
        aria-label={isPlaying ? 'Pause' : 'Play'}
        onClick={togglePlay}
        disabled={!interactable}
        className="!h-12 !w-12 !min-h-12 !min-w-12 rounded-full hover:bg-accent [@media(hover:hover)]:hover:bg-accent-hover active:ring-2 active:ring-accent/35 transition-none"
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
        className="!h-9 !w-9 !min-h-9 !min-w-9 hover:bg-transparent hover:text-foreground hover:translate-y-0 [@media(hover:hover)]:hover:bg-interactive-hover [@media(hover:hover)]:hover:text-accent [@media(hover:hover)]:hover:-translate-y-px active:ring-2 active:ring-accent/35 active:text-accent transition-none"
      >
        <SkipForwardIcon className={`${iconClasses.touch} ${iconClasses.stroke}`} />
      </Button>
    </div>
  );
});
