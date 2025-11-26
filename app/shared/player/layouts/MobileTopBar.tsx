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
}: {
  setMobileOptionsOpen: () => void;
  closePlayer: () => void;
}): React.JSX.Element {
  return (
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
        className="hover:text-red-500"
      >
        <CloseIcon className={`${iconClasses.touch} ${iconClasses.stroke}`} />
      </Button>
    </div>
  );
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
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <CoverAndText title={title} artist={artist} />
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
      <ActionButtons setMobileOptionsOpen={setMobileOptionsOpen} closePlayer={closePlayer} />
    </div>
  );
}
