import React from 'react';

import { CloseIcon, SlidersIcon } from '@/app/shared/icons';
import { SpeedControl } from '@/app/shared/player/components/SpeedControl';
import { TransportControls } from '@/app/shared/player/components/TransportControls';
import { Button } from '@/app/shared/ui/Button';
import { iconClasses } from '@/lib/responsive';

interface Props {
  title: string;
  artist: string;
  isPlaying: boolean;
  interactable: boolean;
  onPrev?: () => boolean;
  onNext?: () => boolean;
  togglePlay: () => void;
  setMobileOptionsOpen: () => void;
  closePlayer: () => void;
}

function CoverAndText({
  title,
  artist,
}: {
  title: string;
  artist: string;
}): React.JSX.Element {
  return (
    <div className="flex items-center gap-2 min-w-0 pl-1">
      <div className="min-w-0">
        <div className="text-sm font-semibold tracking-[-0.01em] truncate text-foreground">
          {title}
        </div>
        <div className="text-xs -mt-0.5 truncate text-muted">{artist}</div>
      </div>
    </div>
  );
}

function ActionButtons({
  setMobileOptionsOpen,
  closePlayer,
  className,
}: {
  setMobileOptionsOpen: () => void;
  closePlayer: () => void;
  className?: string; // Allow overriding layout
}): React.JSX.Element {
  return (
    <div className={className || "flex items-center gap-0.5 xs:gap-1 justify-self-end"}>
      <SpeedControl />
      <button
        className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center shrink-0"
        aria-label="Options"
        onClick={setMobileOptionsOpen}
      >
        <SlidersIcon size={18} />
      </button>
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

function formatMobileTitle(title: string): string {
  if (title.toLowerCase().startsWith('verse')) {
    return title.replace(/^Verse/i, 'Surah');
  }
  if (/^\d+:\d+$/.test(title)) {
    return `Surah ${title}`;
  }
  return title;
}

export function MobileTopBar({
  title,
  artist,
  isPlaying,
  interactable,
  onPrev,
  onNext,
  togglePlay,
  setMobileOptionsOpen,
  closePlayer,
}: Props): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1 w-full min-[450px]:grid min-[450px]:grid-cols-[1fr_auto_1fr] min-[450px]:gap-2 min-[450px]:items-center">
      {/* Mobile Text Header */}
      <div className="flex justify-between items-center px-1 mb-1 min-[450px]:hidden order-1">
        <div className="text-sm font-semibold truncate text-foreground min-w-0">
          {formatMobileTitle(title)}
        </div>
        <div className="text-xs text-muted truncate max-w-[50%] text-right shrink-0">{artist}</div>
      </div>

      {/* Desktop Text - Hidden on mobile */}
      <div className="hidden min-[450px]:block min-w-0 justify-self-start order-first">
        <CoverAndText title={title} artist={artist} />
      </div>

      {/* Controls Container */}
      <div className="grid grid-cols-6 items-center justify-items-center w-full min-[450px]:contents order-2">
        {/* Transport Controls */}
        <div className="contents min-[450px]:flex min-[450px]:items-center min-[450px]:justify-center">
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
            className="contents min-[450px]:flex min-[450px]:items-center min-[450px]:gap-2"
          />
        </div>

        {/* Action Buttons */}
        <div className="contents min-[450px]:flex min-[450px]:items-center min-[450px]:justify-end min-[450px]:justify-self-end">
          <ActionButtons
            setMobileOptionsOpen={setMobileOptionsOpen}
            closePlayer={closePlayer}
            className="contents min-[450px]:flex min-[450px]:items-center min-[450px]:gap-1"
          />
        </div>
      </div>
    </div>
  );
}
