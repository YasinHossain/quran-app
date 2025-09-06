import Image from 'next/image';
import React from 'react';

import { CloseIcon, SlidersIcon } from '@/app/shared/icons';
import { Button } from '@/app/shared/ui/Button';
import { iconClasses } from '@/lib/responsive';

import { SpeedControl } from '../components/SpeedControl';
import { Timeline } from '../components/Timeline';
import { TransportControls } from '../components/TransportControls';

interface MobilePlayerLayoutProps {
  cover: string;
  title: string;
  artist: string;
  current: number;
  duration: number;
  elapsed: string;
  total: string;
  interactable: boolean;
  isPlaying: boolean;
  volume: number;
  togglePlay: () => void;
  setSeek: (sec: number) => void;
  onNext?: () => boolean;
  onPrev?: () => boolean;
  setVolume: (volume: number) => void;
  playbackRate: number;
  setMobileOptionsOpen: (open: boolean) => void;
  closePlayer: () => void;
}

export const MobilePlayerLayout = React.memo(function MobilePlayerLayout({
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
  setMobileOptionsOpen,
  closePlayer,
}: MobilePlayerLayoutProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3 sm:hidden">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="hidden min-[400px]:block flex-shrink-0">
            <Image
              src={cover}
              alt="cover"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full shadow-sm object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><rect width='100%' height='100%' rx='6' ry='6' fill='%23e5e7eb'/></svg>";
              }}
            />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold tracking-[-0.01em] truncate text-foreground">
              {title}
            </div>
            <div className="text-xs -mt-0.5 truncate text-muted">{artist}</div>
          </div>
        </div>
        <TransportControls
          isPlaying={isPlaying}
          disabled={!interactable}
          onPlayPause={togglePlay}
          onNext={onNext}
          onPrev={onPrev}
        />
        <SpeedControl playbackRate={playbackRate} />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileOptionsOpen(true)}
          disabled={!interactable}
          className="p-1.5"
        >
          <SlidersIcon className={iconClasses.sm} />
        </Button>
        <Button variant="ghost" size="sm" onClick={closePlayer} className="p-1.5">
          <CloseIcon className={iconClasses.sm} />
        </Button>
      </div>
      <Timeline
        current={current}
        total={duration}
        elapsed={elapsed}
        totalFormatted={total}
        setSeek={setSeek}
        disabled={!interactable}
        showVolumeControl={true}
        volume={volume}
        setVolume={setVolume}
      />
    </div>
  );
});

export type { MobilePlayerLayoutProps };
