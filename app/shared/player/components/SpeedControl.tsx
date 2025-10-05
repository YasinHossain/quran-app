import * as Popover from '@radix-ui/react-popover';
import { useRef, useState, Dispatch, SetStateAction } from 'react';

import { useAudio } from '@/app/shared/player/context/AudioContext';

interface SpeedPopoverState {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  close: () => void;
}

function useSpeedPopover(): SpeedPopoverState {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const close = (): void => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return { open, setOpen, triggerRef, contentRef, close };
}

function SpeedOptionButton({
  speed,
  active,
  onSelect,
}: {
  speed: number;
  active: boolean;
  onSelect: (v: number) => void;
}): React.JSX.Element {
  return (
    <button
      onClick={() => onSelect(speed)}
      className={`w-full text-center text-sm p-1.5 rounded-md ${
        active ? 'bg-accent text-on-accent' : 'hover:bg-interactive-hover'
      }`}
    >
      {speed}x
    </button>
  );
}

export function SpeedControl(): React.JSX.Element {
  const { playbackRate, setPlaybackRate } = useAudio();
  const { open, setOpen, triggerRef, contentRef, close } = useSpeedPopover();
  const speedOptions = [0.75, 1, 1.25, 1.5, 2];

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
          <SpeedOptionButton
            key={speed}
            speed={speed}
            active={playbackRate === speed}
            onSelect={(v) => {
              setPlaybackRate(v);
              close();
            }}
          />
        ))}
      </Popover.Content>
    </Popover.Root>
  );
}
