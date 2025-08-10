import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import * as Tooltip from '@radix-ui/react-tooltip';

interface Props {
  current: number;
  duration: number;
  setSeek: (sec: number) => void;
  interactable: boolean;
  theme: 'light' | 'dark';
  elapsed: string;
  total: string;
}

export default function Timeline({
  current,
  duration,
  setSeek,
  interactable,
  theme,
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
            <Slider.Track
              className={`h-0.5 rounded-full relative w-full grow ${
                theme === 'dark' ? 'bg-slate-600' : 'bg-[rgba(14,42,71,0.18)]'
              }`}
            >
              <Slider.Range
                className={`h-full rounded-full absolute ${
                  theme === 'dark' ? 'bg-sky-500' : 'bg-[#0E2A47]'
                }`}
              />
            </Slider.Track>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Slider.Thumb
                  className={`block h-3 w-3 rounded-full shadow-[0_1px_2px_rgba(2,6,23,0.15)] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    theme === 'dark'
                      ? 'bg-slate-900 ring-sky-500 focus:ring-sky-500/35'
                      : 'bg-white ring-[#0E2A47] focus:ring-[#0E2A47]/35'
                  }`}
                  aria-label="Position"
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  sideOffset={8}
                  className={`rounded-md text-white text-xs px-2 py-1 shadow ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-slate-900'
                  }`}
                >
                  {elapsed}
                  <Tooltip.Arrow
                    className={theme === 'dark' ? 'fill-slate-700' : 'fill-slate-900'}
                  />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Slider.Root>
        </Tooltip.Provider>
      </div>
      <div
        className={`hidden md:flex min-w-[88px] justify-between text-[11px] tabular-nums ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
        }`}
      >
        <span aria-label="elapsed">{elapsed}</span>
        <span aria-label="duration">{total}</span>
      </div>
    </div>
  );
}
