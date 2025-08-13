import React, { useRef, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { useAudio } from '@/app/shared/player/context/AudioContext';

interface Props {
  theme: 'light' | 'dark';
}

export default function SpeedControl({ theme }: Props) {
  const { playbackRate, setPlaybackRate } = useAudio();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const speedOptions = [0.75, 1, 1.25, 1.5, 2];

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          ref={triggerRef}
          onBlur={(e) => {
            if (!contentRef.current?.contains(e.relatedTarget as Node)) {
              setOpen(false);
            }
          }}
          className={`h-9 w-14 grid place-items-center rounded-full text-xs font-bold transition focus:outline-none focus:ring-2 ${
            theme === 'dark'
              ? 'text-slate-300 focus:ring-sky-500/35 hover:bg-white/10'
              : 'text-[#0E2A47]/80 focus:ring-[#0E2A47]/35 hover:bg-slate-900/5'
          }`}
        >
          {playbackRate}x
        </button>
      </Popover.Trigger>
      <Popover.Content
        ref={contentRef}
        side="top"
        align="center"
        sideOffset={8}
        className={`w-28 rounded-lg shadow-lg border p-1 ${
          theme === 'dark' ? 'bg-slate-700 border-slate-700' : 'bg-white border-slate-200'
        }`}
        onFocusOutside={() => setOpen(false)}
        onEscapeKeyDown={() => setOpen(false)}
        onInteractOutside={() => setOpen(false)}
      >
        {speedOptions.map((speed) => (
          <button
            key={speed}
            onClick={() => {
              setPlaybackRate(speed);
              close();
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
      </Popover.Content>
    </Popover.Root>
  );
}
