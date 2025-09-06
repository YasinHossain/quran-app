'use client';
import React, { useState } from 'react';

import { PlaybackOptionsModal } from './components/PlaybackOptionsModal';
import { MobilePlayerLayout } from './layouts/MobilePlayerLayout';
import { DesktopPlayerLayout } from './layouts/DesktopPlayerLayout';
import { useQuranAudioController } from './hooks/useQuranAudioController';

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
  const [mobileOptionsOpen, setMobileOptionsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'reciter' | 'repeat'>('reciter');

  const { isPlayerVisible, audioRef, handleEnded, playerLayoutProps } =
    useQuranAudioController({ track, onPrev, onNext });

  if (!isPlayerVisible) return null;

  return (
    <div className="relative w-full">
      <div
        className="mx-auto w-full rounded-2xl px-3 py-3 sm:px-4 sm:py-4 bg-surface shadow-lg border border-border"
        role="region"
        aria-label="Player"
      >
        <MobilePlayerLayout
          {...playerLayoutProps}
          setMobileOptionsOpen={setMobileOptionsOpen}
        />
        <DesktopPlayerLayout
          {...playerLayoutProps}
          setDesktopOptionsOpen={setMobileOptionsOpen}
        />
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
