import * as Slider from '@radix-ui/react-slider';
import { memo } from 'react';

import { VolumeIcon, VolumeOffIcon } from '@/app/shared/icons';
import { useAudio } from '@/app/shared/player/context/AudioContext';

/**
 * Provides mobile and desktop controls for adjusting audio volume.
 */
export const VolumeControl = memo(function VolumeControl(): React.JSX.Element {
  const { volume, setVolume } = useAudio();
  return (
    <>
      {/* Mobile: Volume icon only */}
      <button
        className="h-8 w-8 grid place-items-center rounded-full transition hover:bg-gray-200 dark:hover:bg-slate-700 md:hidden"
        onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
        aria-label={volume === 0 ? 'Unmute' : 'Mute'}
      >
        {volume === 0 ? (
          <VolumeOffIcon className="h-4 w-4 opacity-80 text-muted" />
        ) : (
          <VolumeIcon className="h-4 w-4 opacity-80 text-muted" />
        )}
      </button>

      {/* Desktop: Volume slider */}
      <div className="hidden md:flex items-center gap-2 w-20 lg:w-28">
        {volume === 0 ? (
          <VolumeOffIcon className="h-4 w-4 opacity-80 text-muted" />
        ) : (
          <VolumeIcon className="h-4 w-4 opacity-80 text-muted" />
        )}
        <Slider.Root
          className="relative w-full h-2.5 group flex items-center"
          value={[volume]}
          max={1}
          step={0.01}
          onValueChange={([v]) => {
            if (typeof v === 'number') setVolume(v);
          }}
          aria-label="Volume"
        >
          <Slider.Track className="h-0.5 rounded-full relative w-full grow bg-gray-200 dark:bg-slate-700">
            <Slider.Range className="h-full rounded-full absolute bg-accent" />
          </Slider.Track>
          <Slider.Thumb className="block h-3 w-3 rounded-full shadow-[0_1px_2px_rgba(2,6,23,0.15)] focus:outline-none bg-accent transition-transform active:scale-110 active:ring-2 active:ring-offset-2 cursor-pointer" />
        </Slider.Root>
      </div>
    </>
  );
});
