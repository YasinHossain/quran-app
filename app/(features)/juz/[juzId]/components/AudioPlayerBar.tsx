import React from 'react';

import { QuranAudioPlayer } from '@/app/shared/player';

export function AudioPlayerBar({
  isHidden,
  track,
  activeVerseExists,
  isPlayerVisible,
  onNext,
  onPrev,
}: {
  isHidden: boolean;
  track: import('@/app/shared/player/types').Track | null;
  activeVerseExists: boolean;
  isPlayerVisible: boolean;
  onNext: () => boolean;
  onPrev: () => boolean;
}): JSX.Element | null {
  if (!activeVerseExists || !isPlayerVisible || !track) return null;
  return (
    <div
      className={`fixed left-0 right-0 p-4 bg-transparent z-audio-player transition-all duration-300 ease-in-out ${
        isHidden ? 'bottom-0 pb-safe' : 'bottom-0 pb-safe lg:pb-4'
      } lg:left-1/2 lg:-translate-x-1/2 lg:right-auto lg:w-[min(90vw,60rem)]`}
      style={{
        bottom: isHidden
          ? 'env(safe-area-inset-bottom)'
          : 'calc(5rem + env(safe-area-inset-bottom))',
      }}
    >
      <QuranAudioPlayer track={track} onNext={onNext} onPrev={onPrev} />
    </div>
  );
}

