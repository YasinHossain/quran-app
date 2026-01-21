'use client';
import React, { useState, useEffect, useCallback } from 'react';

import { useAudio } from '@/app/shared/player/context/AudioContext';
import { logger } from '@/src/infrastructure/monitoring/Logger';

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

type PlaybackError = {
  code: number | null;
  message: string;
};

function getMediaErrorMessage(code: number | null): string {
  switch (code) {
    case 1:
      return 'Audio load was interrupted.';
    case 2:
      return 'Network error while loading audio.';
    case 3:
      return 'Audio decoding failed.';
    case 4:
      return 'Audio format is not supported.';
    default:
      return 'Audio playback failed.';
  }
}

function getMediaErrorHint(code: number | null): string {
  switch (code) {
    case 2:
      return 'Please check your connection and try again.';
    case 3:
    case 4:
      return 'Try switching reciters or using a different browser.';
    default:
      return 'Try again in a moment.';
  }
}

export function QuranAudioPlayer({
  track,
  onPrev,
  onNext,
}: QuranAudioPlayerProps): React.JSX.Element | null {
  const audioContext = useAudio();
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

  const [playbackError, setPlaybackError] = useState<PlaybackError | null>(null);

  useEffect(() => {
    setPlaybackError(null);
  }, [track?.src]);

  const handleAudioError = useCallback(() => {
    const el = audioRef.current;
    const code = el?.error?.code ?? null;

    // We intentionally abort loads (e.g. rapid seeks/src swaps). Don't surface as a "connection" failure.
    if (code === 1) return;

    logger.error('Audio element error', {
      src: track?.src ?? null,
      currentSrc: el?.currentSrc ?? null,
      errorCode: code,
      networkState: el?.networkState ?? null,
      readyState: el?.readyState ?? null,
    });

    audioContext.setIsPlaying(false);
    setPlaybackError({ code, message: getMediaErrorMessage(code) });
  }, [audioContext, audioRef, track?.src]);

  const handleAudioReady = useCallback(() => {
    setPlaybackError(null);
  }, []);

  const handleRetry = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;

    setPlaybackError(null);

    try {
      el.load();
    } catch {
      // ignore reload errors
    }

    el.play()
      .then(() => {
        audioContext.setIsPlaying(true);
      })
      .catch((err) => {
        logger.warn('Audio retry play() failed', {
          src: track?.src ?? null,
          error: err instanceof Error ? err.message : String(err),
        });
      });
  }, [audioContext, audioRef, track?.src]);

  if (!isPlayerVisible) return null;

  return (
    <div className="relative w-full">
      {playbackError && (
        <div className="absolute bottom-full mb-2 left-0 right-0 rounded-lg border border-status-error/25 bg-status-error/10 p-2 text-center text-xs text-status-error">
          <div>
            {playbackError.message} {getMediaErrorHint(playbackError.code)}
          </div>
          <button
            type="button"
            className="mt-2 inline-flex min-h-touch items-center justify-center rounded-md bg-button-secondary px-3 py-1 text-xs text-foreground hover:bg-button-secondary-hover"
            onClick={handleRetry}
          >
            Retry
          </button>
        </div>
      )}
      <PlayerLayouts {...playerLayoutProps} />
      <PlayerAudio
        ref={audioRef}
        src={track?.src || ''}
        onEnded={handleEnded}
        onError={handleAudioError}
        onCanPlay={handleAudioReady}
        onPlaying={handleAudioReady}
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
  React.forwardRef<
    HTMLAudioElement,
    {
      src: string;
      onEnded: () => void;
      onError: () => void;
      onCanPlay: () => void;
      onPlaying: () => void;
    }
  >(function PlayerAudio({ src, onEnded, onError, onCanPlay, onPlaying }, ref) {
    return (
      <audio
        ref={ref}
        src={src}
        preload="metadata"
        onEnded={onEnded}
        onError={onError}
        onCanPlay={onCanPlay}
        onPlaying={onPlaying}
      >
        <track kind="captions" />
      </audio>
    );
  })
);
