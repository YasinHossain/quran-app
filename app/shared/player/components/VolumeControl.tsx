import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '@/app/shared/player/context/AudioContext';

export default function VolumeControl() {
  const { volume, setVolume } = useAudio();
  return (
    <>
      {/* Mobile: Volume icon only */}
      <button
        className="h-8 w-8 grid place-items-center rounded-full transition hover:bg-interactive-hover md:hidden"
        onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
        aria-label={volume === 0 ? 'Unmute' : 'Mute'}
      >
        {volume === 0 ? (
          <VolumeX className="h-4 w-4 opacity-80 text-muted" />
        ) : (
          <Volume2 className="h-4 w-4 opacity-80 text-muted" />
        )}
      </button>

      {/* Desktop: Volume slider */}
      <div className="hidden md:flex items-center gap-2 w-20 lg:w-28">
        {volume === 0 ? (
          <VolumeX className="h-4 w-4 opacity-80 text-muted" />
        ) : (
          <Volume2 className="h-4 w-4 opacity-80 text-muted" />
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
    </>
  );
}
