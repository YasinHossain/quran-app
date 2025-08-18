import React from 'react';
import { SkipBack, SkipForward, Play, Pause } from 'lucide-react';
import IconBtn from './IconBtn';

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
      <IconBtn aria-label="Previous track" onClick={onPrev} disabled={!interactable}>
        <SkipBack />
      </IconBtn>
      <button
        aria-label={isPlaying ? 'Pause' : 'Play'}
        onClick={togglePlay}
        disabled={!interactable}
        className={`h-10 w-10 grid place-items-center rounded-full text-white hover:opacity-90 active:scale-95 transition ${
          interactable
            ? 'bg-accent hover:bg-accent-hover'
            : 'bg-disabled cursor-not-allowed opacity-60'
        }`}
      >
        {isPlaying ? <Pause /> : <Play />}
      </button>
      <IconBtn aria-label="Next track" onClick={onNext} disabled={!interactable}>
        <SkipForward />
      </IconBtn>
    </div>
  );
}
