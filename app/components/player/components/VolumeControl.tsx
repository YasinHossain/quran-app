import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '@/app/context/AudioContext';

interface Props {
  theme: 'light' | 'dark';
}

export default function VolumeControl({ theme }: Props) {
  const { volume, setVolume } = useAudio();
  return (
    <div className="hidden lg:flex items-center gap-2 w-28">
      {volume === 0 ? (
        <VolumeX
          className={`opacity-80 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}
        />
      ) : (
        <Volume2
          className={`opacity-80 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}
        />
      )}
      <Slider.Root
        className="relative w-full h-2.5 group flex items-center"
        value={[volume]}
        max={1}
        step={0.01}
        onValueChange={([v]) => {
          setVolume(v);
        }}
        aria-label="Volume"
      >
        <Slider.Track
          className={`h-0.5 rounded-full relative w-full grow ${
            theme === 'dark' ? 'bg-slate-600' : 'bg-[rgba(14,42,71,0.2)]'
          }`}
        >
          <Slider.Range
            className={`h-full rounded-full absolute ${
              theme === 'dark' ? 'bg-sky-500' : 'bg-[#0E2A47]'
            }`}
          />
        </Slider.Track>
        <Slider.Thumb
          className={`block h-3 w-3 rounded-full focus:outline-none ring-2 ${
            theme === 'dark' ? 'bg-slate-900 ring-sky-500' : 'bg-white ring-[#0E2A47]'
          }`}
        />
      </Slider.Root>
    </div>
  );
}
