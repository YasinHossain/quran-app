'use client';

import { useRef, useState } from 'react';

import { PauseIcon, PlayIcon } from '@/app/shared/icons';

/**
 * Play/pause for the whole-surah recitation inside the "Recitation" fact tile, with a progress
 * line along the tile's bottom edge. The audio loads only when first played (`preload="none"`).
 */
export function RecitationPlayButton({
  src,
  playLabel,
  pauseLabel,
}: {
  src: string;
  playLabel: string;
  pauseLabel: string;
}): React.JSX.Element {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = (): void => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? pauseLabel : playLabel}
        className="absolute end-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-accent text-on-accent shadow-[0_6px_16px_-6px_rgb(var(--color-accent)/0.8)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface motion-reduce:transition-none motion-reduce:hover:scale-100"
      >
        {playing ? <PauseIcon size={18} /> : <PlayIcon size={18} className="ms-0.5" />}
      </button>
      {/* Quran recitation: no caption track exists; the text is on this page and the reader. */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
        onTimeUpdate={(event) => {
          const { currentTime, duration } = event.currentTarget;
          if (duration > 0) setProgress(currentTime / duration);
        }}
      />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-accent/10">
        <span
          className="block h-full bg-accent transition-[width] duration-300 ease-linear motion-reduce:transition-none"
          style={{ width: `${progress * 100}%` }}
        />
      </span>
    </>
  );
}
