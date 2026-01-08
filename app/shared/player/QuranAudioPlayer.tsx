'use client';
import React, { useState, useEffect, useCallback } from 'react';

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

  const [playbackError, setPlaybackError] = useState(false);

  useEffect(() => {
    setPlaybackError(false);
  }, [track?.src]);

  const handleAudioError = useCallback(() => {
    console.error('Audio playback failed for source:', track?.src);
    setPlaybackError(true);
  }, [track?.src]);

  if (!isPlayerVisible) return null;

  return (
    <div className="relative w-full">
      {playbackError && (
        <div className="absolute bottom-full mb-2 left-0 right-0 bg-red-500/10 text-red-600 dark:text-red-400 p-2 text-xs rounded-lg text-center border border-red-500/20 backdrop-blur-sm">
          Playback failed. Please check your connection.
        </div>
      )}
      <PlayerLayouts {...playerLayoutProps} />
      <PlayerAudio
        ref={audioRef}
        src={track?.src || ''}
        onEnded={handleEnded}
        onError={handleAudioError}
      />
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
      className="mx-auto w-full rounded-lg px-3 py-3 sm:px-4 sm:py-4 bg-surface shadow-lg"
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
  React.forwardRef<HTMLAudioElement, { src: string; onEnded: () => void; onError: () => void }>(
    function PlayerAudio({ src, onEnded, onError }, ref) {
      return (
        <audio ref={ref} src={src} preload="metadata" onEnded={onEnded} onError={onError}>
          <track kind="captions" />
        </audio>
      );
    }
  )
);
