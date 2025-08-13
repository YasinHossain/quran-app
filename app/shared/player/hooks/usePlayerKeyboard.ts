import { useEffect, Dispatch, SetStateAction } from 'react';

interface Options {
  current: number;
  duration: number;
  setSeek: (sec: number) => void;
  togglePlay: () => void;
  setVolume: Dispatch<SetStateAction<number>>;
}

export default function usePlayerKeyboard({
  current,
  duration,
  setSeek,
  togglePlay,
  setVolume,
}: Options) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest('input, textarea, [role=slider]')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'ArrowLeft') setSeek(Math.max(0, current - 5));
      if (e.key === 'ArrowRight') setSeek(Math.min(duration || 0, current + 5));
      if (e.key === 'ArrowUp') setVolume((v) => Math.min(1, round(v + 0.05)));
      if (e.key === 'ArrowDown') setVolume((v) => Math.max(0, round(v - 0.05)));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, duration, setSeek, togglePlay, setVolume]);
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}
