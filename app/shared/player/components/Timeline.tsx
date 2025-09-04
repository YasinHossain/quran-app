import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import * as Tooltip from '@radix-ui/react-tooltip';
import { responsiveClasses } from '@/lib/responsive';

interface Props {
  current: number;
  duration: number;
  setSeek: (sec: number) => void;
  interactable: boolean;
  elapsed: string;
  total: string;
}

export function Timeline({
  current,
  duration,
  setSeek,
  interactable,
  elapsed,
  total,
}: Props) {
  return (
    <div className="flex-1 flex items-center gap-3">
      <div className="flex-1">
        <Tooltip.Provider delayDuration={150}>
          <Slider.Root
            className={`relative w-full h-2.5 group flex items-center ${
              !interactable ? 'opacity-60 pointer-events-none' : ''
            }`}
            value={[current]}
            max={Math.max(1, duration || 0)}
            step={0.1}
            onValueChange={([v]) => setSeek(v)}
            aria-label="Seek"
          >
            <Slider.Track className="h-0.5 rounded-full relative w-full grow bg-surface group-hover:bg-interactive-hover">
              <Slider.Range className="h-full rounded-full absolute bg-accent" />
            </Slider.Track>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Slider.Thumb
                  className="block h-3 w-3 rounded-full shadow-[0_1px_2px_rgba(2,6,23,0.15)] focus:outline-none focus:ring-2 focus:ring-offset-2 bg-background ring-accent focus:ring-accent/35 relative z-[120]"
                  aria-label="Position"
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  sideOffset={8}
                  className="rounded-md text-foreground text-xs px-2 py-1 shadow bg-surface z-[120]"
                >
                  {elapsed}
                  <Tooltip.Arrow className="fill-surface" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Slider.Root>
        </Tooltip.Provider>
      </div>
      <div
        className={`flex justify-between ${responsiveClasses.timeDisplay} ${responsiveClasses.timeLabel}`}
      >
        <span aria-label="elapsed">{elapsed}</span>
        <span aria-label="duration">{total}</span>
      </div>
    </div>
  );
}
