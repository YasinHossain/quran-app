import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '@/app/shared/player/context/AudioContext';

export default function VolumeControl() {
  const { volume, setVolume } = useAudio();
  return (
    <div className="hidden lg:flex items-center gap-2 w-28">
      {volume === 0 ? (
        <VolumeX className="opacity-80 text-muted" />
      ) : (
        <Volume2 className="opacity-80 text-muted" />
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
        <Slider.Track className="h-0.5 rounded-full relative w-full grow bg-surface group-hover:bg-interactive-hover">
          <Slider.Range className="h-full rounded-full absolute bg-accent" />
        </Slider.Track>
        <Slider.Thumb className="block h-3 w-3 rounded-full focus:outline-none ring-2 bg-background ring-accent" />
      </Slider.Root>
    </div>
  );
}
