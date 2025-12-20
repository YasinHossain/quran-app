import React from 'react';

import { CloseIcon } from '@/app/shared/icons';
import { PlayerOptions } from '@/app/shared/player/components/PlayerOptions';
import { Timeline } from '@/app/shared/player/components/Timeline';
import { TrackInfo } from '@/app/shared/player/components/TrackInfo';
import { TransportControls } from '@/app/shared/player/components/TransportControls';

interface DesktopPlayerLayoutProps {
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
      <div className="flex items-center gap-4 min-w-0">
        <div className="hidden md:block min-w-0">
          <TrackInfo title={title} artist={artist} />
        </div>
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
      </div>
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
      <button
        aria-label="Close player"
        onClick={closePlayer}
        className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center hover:text-red-500"
      >
        <CloseIcon size={18} />
      </button>
    </div>
  );
}

export type { DesktopPlayerLayoutProps };
