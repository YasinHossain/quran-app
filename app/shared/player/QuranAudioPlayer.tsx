'use client';
import React from 'react';

import { PlaybackOptionsModal } from './components/PlaybackOptionsModal';
import { useQuranAudioController } from './hooks/useQuranAudioController';
import { DesktopPlayerLayout } from './layouts/DesktopPlayerLayout';
import { MobilePlayerLayout } from './layouts/MobilePlayerLayout';

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
    track,
    onPrev,
    onNext,
  });

  if (!isPlayerVisible) return null;

  return (
    <div className="relative w-full">
      <div
        className="mx-auto w-full rounded-2xl px-3 py-3 sm:px-4 sm:py-4 bg-surface shadow-lg border border-border"
        role="region"
        aria-label="Player"
      >
        {/* Mobile Layout */}
        <div className="flex flex-col gap-3 sm:hidden">
          <MobilePlayerLayout {...playerLayoutProps} />
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center gap-4">
          <DesktopPlayerLayout {...playerLayoutProps} />
        </div>
      </div>
      <audio ref={audioRef} src={track?.src || ''} preload="metadata" onEnded={handleEnded}>
        <track kind="captions" />
      </audio>

      {/* Mobile Options Modal */}
      <PlaybackOptionsModal
        open={mobileOptionsOpen}
        onClose={() => setMobileOptionsOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
