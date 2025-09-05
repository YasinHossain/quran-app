import * as Popover from '@radix-ui/react-popover';
import React, { useRef, useState } from 'react';

import { useAudio } from '@/app/shared/player/context/AudioContext';

export function SpeedControl() {
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
          className="h-9 w-14 grid place-items-center rounded-full text-xs font-bold transition focus:outline-none focus:ring-2 text-foreground focus:ring-accent/35 hover:bg-interactive-hover"
        >
          {playbackRate}x
        </button>
      </Popover.Trigger>
      <Popover.Content
        ref={contentRef}
        side="top"
        align="center"
        sideOffset={8}
        className="w-28 rounded-lg shadow-lg border p-1 bg-surface border-surface"
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
              playbackRate === speed ? 'bg-accent text-on-accent' : 'hover:bg-interactive-hover'
            }`}
          >
            {speed}x
          </button>
        ))}
      </Popover.Content>
    </Popover.Root>
  );
}
