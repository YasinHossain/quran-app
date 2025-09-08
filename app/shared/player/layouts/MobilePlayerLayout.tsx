import Image from 'next/image';
import React from 'react';

import { CloseIcon, SlidersIcon } from '@/app/shared/icons';
import { SpeedControl } from '@/app/shared/player/components/SpeedControl';
import { Timeline } from '@/app/shared/player/components/Timeline';
import { TransportControls } from '@/app/shared/player/components/TransportControls';
import { Button } from '@/app/shared/ui/Button';
import { iconClasses } from '@/lib/responsive';

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
  togglePlay: () => void;
  setSeek: (sec: number) => void;
  onNext?: () => boolean;
  onPrev?: () => boolean;
  setMobileOptionsOpen: () => void;
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
  togglePlay,
  setSeek,
  onNext,
  onPrev,
  setMobileOptionsOpen,
  closePlayer,
}: MobilePlayerLayoutProps): React.JSX.Element {
  return (
    <>
      {/* Top row uses 3-column grid to keep transport perfectly centered */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex items-center gap-2 min-w-0">
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
          /* keep controls visually centered */

          isPlaying={isPlaying}
          interactable={interactable}
          onPrev={onPrev}
          onNext={onNext}
          togglePlay={togglePlay}
        />
        <div className="flex items-center gap-1 justify-self-end">
          <SpeedControl />
          <Button
            variant="icon-round"
            size="icon-round"
            className="shrink-0"
            aria-label="Options"
            onClick={setMobileOptionsOpen}
          >
            <SlidersIcon className={`${iconClasses.touch} ${iconClasses.stroke}`} />
          </Button>
          <Button
            variant="icon-round"
            size="icon-round"
            aria-label="Close player"
            onClick={closePlayer}
          >
            <CloseIcon className={`${iconClasses.touch} ${iconClasses.stroke}`} />
          </Button>
        </div>
      </div>
      <Timeline
        current={current}
        duration={duration}
        setSeek={setSeek}
        interactable={interactable}
        elapsed={elapsed}
        total={total}
      />
    </>
  );
});

export type { MobilePlayerLayoutProps };
