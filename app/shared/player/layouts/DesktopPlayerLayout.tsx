import Image from 'next/image';
import React from 'react';

import { CloseIcon } from '@/app/shared/icons';
import { Button } from '@/app/shared/ui/Button';
import { iconClasses } from '@/lib/responsive';

import { PlayerOptions } from '../components/PlayerOptions';
import { SpeedControl } from '../components/SpeedControl';
import { Timeline } from '../components/Timeline';
import { TrackInfo } from '../components/TrackInfo';
import { TransportControls } from '../components/TransportControls';

import type { MobilePlayerLayoutProps } from './MobilePlayerLayout';

interface DesktopPlayerLayoutProps extends MobilePlayerLayoutProps {
  setDesktopOptionsOpen: (open: boolean) => void;
}

export const DesktopPlayerLayout = React.memo(function DesktopPlayerLayout({
  cover,
  title,
  artist,
  current,
  duration,
  elapsed,
  total,
  interactable,
  isPlaying,
  volume,
  togglePlay,
  setSeek,
  onNext,
  onPrev,
  setVolume,
  playbackRate,
  setMobileOptionsOpen: setDesktopOptionsOpen,
  closePlayer,
}: DesktopPlayerLayoutProps): React.JSX.Element {
  return (
    <div className="hidden sm:flex items-center gap-4">
      <div className="flex-shrink-0">
        <Image
          src={cover}
          alt="cover"
          width={48}
          height={48}
          className="h-12 w-12 rounded-lg shadow-md object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><rect width='100%' height='100%' rx='8' ry='8' fill='%23e5e7eb'/></svg>";
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <TrackInfo title={title} artist={artist} />
        <div className="flex items-center gap-3">
          <div className="flex-1 max-w-md">
            <Timeline
              current={current}
              total={duration}
              elapsed={elapsed}
              totalFormatted={total}
              setSeek={setSeek}
              disabled={!interactable}
            />
          </div>
          <TransportControls
            isPlaying={isPlaying}
            disabled={!interactable}
            onPlayPause={togglePlay}
            onNext={onNext}
            onPrev={onPrev}
          />
          <SpeedControl playbackRate={playbackRate} />
          <PlayerOptions
            onOpenSettings={() => setDesktopOptionsOpen(true)}
            disabled={!interactable}
            showVolumeControl={true}
            volume={volume}
            setVolume={setVolume}
          />
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={closePlayer} className="p-1.5">
        <CloseIcon className={iconClasses.sm} />
      </Button>
    </div>
  );
});

export type { DesktopPlayerLayoutProps };
