import React from 'react';
import { SkipBack, SkipForward, Play, Pause } from 'lucide-react';
import { Button } from '@/presentation/shared/ui/Button';
import { iconClasses } from '@/lib/responsive';

interface Props {
  isPlaying: boolean;
  interactable: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  togglePlay: () => void;
}

export default function TransportControls({
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
        <SkipBack className={`${iconClasses.touch} ${iconClasses.stroke}`} />
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
          <Pause className={iconClasses.touch} />
        ) : (
          <Play className={iconClasses.touch} />
        )}
      </Button>
      <Button
        variant="icon-round"
        size="icon-round"
        aria-label="Next track"
        onClick={onNext}
        disabled={!interactable}
      >
        <SkipForward className={`${iconClasses.touch} ${iconClasses.stroke}`} />
      </Button>
    </div>
  );
}
