'use client';

import { memo } from 'react';

import { PlayIcon, PauseIcon } from '@/app/shared/icons';
import { Spinner } from '@/app/shared/Spinner';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

interface PlayPauseButtonProps {
  isPlaying: boolean;
  isLoadingAudio: boolean;
  onPlayPause: () => void;
}

export const PlayPauseButton = memo(function PlayPauseButton({
  isPlaying,
  isLoadingAudio,
  onPlayPause,
}: PlayPauseButtonProps): React.JSX.Element {
  return (
    <button
      aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
      onClick={onPlayPause}
      title="Play/Pause"
      className={cn(
        'p-1.5 rounded-full hover:bg-accent/10 transition',
        isPlaying ? 'text-accent' : 'hover:text-accent',
        touchClasses.focus
      )}
    >
      {isLoadingAudio ? (
        <Spinner className="h-4 w-4 text-accent" />
      ) : isPlaying ? (
        <PauseIcon size={18} />
      ) : (
        <PlayIcon size={18} />
      )}
    </button>
  );
});
