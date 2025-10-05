import React from 'react';

import { CloseIcon } from '@/app/shared/icons';
import { PlayerOptions } from '@/app/shared/player/components/PlayerOptions';
import { Timeline } from '@/app/shared/player/components/Timeline';
import { TrackInfo } from '@/app/shared/player/components/TrackInfo';
import { TransportControls } from '@/app/shared/player/components/TransportControls';
import { Button } from '@/app/shared/ui/Button';
import { iconClasses } from '@/lib/responsive';

interface DesktopPlayerLayoutProps {
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
  closePlayer: () => void;
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
  togglePlay,
  setSeek,
  onNext,
  onPrev,
  closePlayer,
}: DesktopPlayerLayoutProps): React.JSX.Element {
  return (
    <>
      <TrackInfo cover={cover} title={title} artist={artist} />
      <TransportControls
        isPlaying={isPlaying}
        interactable={interactable}
        {...(onPrev
          ? {
              onPrev: () => {
                void onPrev();
              },
            }
          : {})}
        {...(onNext
          ? {
              onNext: () => {
                void onNext();
              },
            }
          : {})}
        togglePlay={togglePlay}
      />
      <Timeline
        current={current}
        duration={duration}
        setSeek={setSeek}
        interactable={interactable}
        elapsed={elapsed}
        total={total}
      />
      <Utilities closePlayer={closePlayer} />
    </>
  );
});

function Utilities({ closePlayer }: { closePlayer: () => void }): React.JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <PlayerOptions />
      <Button
        variant="icon-round"
        size="icon-round"
        aria-label="Close player"
        onClick={closePlayer}
      >
        <CloseIcon className={`${iconClasses.touch} ${iconClasses.stroke}`} />
      </Button>
    </div>
  );
}

export type { DesktopPlayerLayoutProps };
