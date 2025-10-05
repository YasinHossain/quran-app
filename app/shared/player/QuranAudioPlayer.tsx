'use client';
import React from 'react';

import { PlaybackOptionsModal } from './components/PlaybackOptionsModal';
import { useQuranAudioController } from './hooks/useQuranAudioController';
import { DesktopPlayerLayout } from './layouts/DesktopPlayerLayout';
import { MobilePlayerLayout } from './layouts/MobilePlayerLayout';

import type { DesktopPlayerLayoutProps } from './layouts/DesktopPlayerLayout';
import type { MobilePlayerLayoutProps } from './layouts/MobilePlayerLayout';
import type { Track } from './types';

interface QuranAudioPlayerProps {
  track?: Track | null;
  onPrev?: () => boolean;
  onNext?: () => boolean;
}

export function QuranAudioPlayer({
  track,
  onPrev,
  onNext,
}: QuranAudioPlayerProps): React.JSX.Element | null {
  const {
    isPlayerVisible,
    audioRef,
    handleEnded,
    playerLayoutProps,
    mobileOptionsOpen,
    setMobileOptionsOpen,
    activeTab,
    setActiveTab,
  } = useQuranAudioController({
    ...(track !== undefined ? { track } : {}),
    ...(onPrev ? { onPrev } : {}),
    ...(onNext ? { onNext } : {}),
  });

  if (!isPlayerVisible) return null;

  return (
    <div className="relative w-full">
      <PlayerLayouts {...playerLayoutProps} />
      <PlayerAudio ref={audioRef} src={track?.src || ''} onEnded={handleEnded} />
      <PlaybackOptionsModal
        open={mobileOptionsOpen}
        onClose={() => setMobileOptionsOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

type PlayerLayoutProps = DesktopPlayerLayoutProps & MobilePlayerLayoutProps;

const PlayerLayouts = React.memo(function PlayerLayouts(props: PlayerLayoutProps) {
  return (
    <div
      className="mx-auto w-full rounded-2xl px-3 py-3 sm:px-4 sm:py-4 bg-surface shadow-lg border border-border"
      role="region"
      aria-label="Player"
    >
      <div className="flex flex-col gap-3 sm:hidden">
        <MobilePlayerLayout {...props} />
      </div>
      <div className="hidden sm:flex items-center gap-4">
        <DesktopPlayerLayout {...props} />
      </div>
    </div>
  );
});

const PlayerAudio = React.memo(
  React.forwardRef<HTMLAudioElement, { src: string; onEnded: () => void }>(function PlayerAudio(
    { src, onEnded },
    ref
  ) {
    return (
      <audio ref={ref} src={src} preload="metadata" onEnded={onEnded}>
        <track kind="captions" />
      </audio>
    );
  })
);
