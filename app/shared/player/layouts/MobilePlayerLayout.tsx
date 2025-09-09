import React from 'react';

import { Timeline } from '@/app/shared/player/components/Timeline';
import { MobileTopBar } from '@/app/shared/player/layouts/MobileTopBar';

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
      <MobileTopBar
        cover={cover}
        title={title}
        artist={artist}
        isPlaying={isPlaying}
        interactable={interactable}
        onPrev={onPrev}
        onNext={onNext}
        togglePlay={togglePlay}
        setMobileOptionsOpen={setMobileOptionsOpen}
        closePlayer={closePlayer}
      />
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
