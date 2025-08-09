import React, { useState } from 'react';
import { useAudio } from '@/app/context/AudioContext';

interface Props {
  theme: 'light' | 'dark';
}

export default function SpeedControl({ theme }: Props) {
  const { playbackRate, setPlaybackRate } = useAudio();
  const [open, setOpen] = useState(false);
  const speedOptions = [0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="relative hidden sm:block">
      <button
        onClick={() => setOpen((s) => !s)}
        className={`h-9 w-14 grid place-items-center rounded-full text-xs font-bold transition focus:outline-none focus:ring-2 ${
          theme === 'dark'
            ? 'text-slate-300 focus:ring-sky-500/35 hover:bg-white/10'
            : 'text-[#0E2A47]/80 focus:ring-[#0E2A47]/35 hover:bg-slate-900/5'
        }`}
      >
        {playbackRate}x
      </button>
      {open && (
        <div
          className={`absolute bottom-full mb-2 w-28 rounded-lg shadow-lg border p-1 ${
            theme === 'dark' ? 'bg-slate-700 border-slate-700' : 'bg-white border-slate-200'
          }`}
          onMouseLeave={() => setOpen(false)}
        >
          {speedOptions.map((speed) => (
            <button
              key={speed}
              onClick={() => {
                setPlaybackRate(speed);
                setOpen(false);
              }}
              className={`w-full text-center text-sm p-1.5 rounded-md ${
                playbackRate === speed
                  ? theme === 'dark'
                    ? 'bg-sky-500 text-white'
                    : 'bg-[#0E2A47] text-white'
                  : theme === 'dark'
                    ? 'hover:bg-slate-600'
                    : 'hover:bg-slate-100'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
