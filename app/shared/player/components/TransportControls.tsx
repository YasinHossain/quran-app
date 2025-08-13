import React from 'react';
import { SkipBack, SkipForward, Play, Pause } from 'lucide-react';
import IconBtn from './IconBtn';

interface Props {
  isPlaying: boolean;
  interactable: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  togglePlay: () => void;
  theme: 'light' | 'dark';
}

export default function TransportControls({
  isPlaying,
  interactable,
  onPrev,
  onNext,
  togglePlay,
  theme,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <IconBtn aria-label="Previous track" onClick={onPrev} disabled={!interactable} theme={theme}>
        <SkipBack />
      </IconBtn>
      <button
        aria-label={isPlaying ? 'Pause' : 'Play'}
        onClick={togglePlay}
        disabled={!interactable}
        className={`h-10 w-10 grid place-items-center rounded-full text-white hover:opacity-90 active:scale-95 transition ${
          interactable
            ? theme === 'dark'
              ? 'bg-sky-500'
              : 'bg-[#0E2A47]'
            : theme === 'dark'
              ? 'bg-slate-600 cursor-not-allowed opacity-60'
              : 'bg-slate-300 cursor-not-allowed opacity-60'
        }`}
      >
        {isPlaying ? <Pause /> : <Play />}
      </button>
      <IconBtn aria-label="Next track" onClick={onNext} disabled={!interactable} theme={theme}>
        <SkipForward />
      </IconBtn>
    </div>
  );
}
