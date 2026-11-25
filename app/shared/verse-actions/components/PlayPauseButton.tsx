'use client';

import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { PlayIcon, PauseIcon } from '@/app/shared/icons';
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
  const { t } = useTranslation();
  const label = isPlaying ? t('pause_audio') : t('play_audio');
  return (
    <button
      aria-label={label}
      onClick={onPlayPause}
      disabled={isLoadingAudio}
      aria-busy={isLoadingAudio}
      title={label}
      className={cn(
        'p-1.5 rounded-full hover:bg-interactive-hover transition flex items-center justify-center',
        isPlaying ? 'text-accent' : 'hover:text-accent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        touchClasses.target,
        touchClasses.focus
      )}
    >
      {isPlaying ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
    </button>
  );
});
