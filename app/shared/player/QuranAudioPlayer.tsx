'use client';
import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { CloseIcon, SlidersIcon } from '@/app/shared/icons';
import { useAudio } from '@/app/shared/player/context/AudioContext';
import { useAudioPlayer } from '@/app/shared/player/hooks/useAudioPlayer';
import { usePlaybackCompletion } from '@/app/shared/player/hooks/usePlaybackCompletion';
import { usePlayerKeyboard } from '@/app/shared/player/hooks/usePlayerKeyboard';
import { Button } from '@/app/shared/ui/Button';
import { iconClasses } from '@/lib/responsive';

import { PlaybackOptionsModal } from './components/PlaybackOptionsModal';
import { PlayerOptions } from './components/PlayerOptions';
import { SpeedControl } from './components/SpeedControl';
import { Timeline } from './components/Timeline';
import { TrackInfo } from './components/TrackInfo';
import { TransportControls } from './components/TransportControls';

import type { Track } from './types';

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
  volume: number;
  togglePlay: () => void;
  setSeek: (sec: number) => void;
  onNext?: () => boolean;
  onPrev?: () => boolean;
  setVolume: (volume: number) => void;
  playbackRate: number;
  setMobileOptionsOpen: (open: boolean) => void;
  closePlayer: () => void;
}

const MobilePlayerLayout = React.memo(function MobilePlayerLayout({
  cover,
  title,
  artist,
  current,
  duration,
  elapsed,
  total,
  interactable,
  isPlaying,
  volume,
  togglePlay,
  setSeek,
  onNext,
  onPrev,
  setVolume,
  playbackRate,
  setMobileOptionsOpen,
  closePlayer,
}: MobilePlayerLayoutProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3 sm:hidden">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="hidden min-[400px]:block flex-shrink-0">
            <Image
              src={cover}
              alt="cover"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full shadow-sm object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><rect width='100%' height='100%' rx='6' ry='6' fill='%23e5e7eb'/></svg>";
              }}
            />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold tracking-[-0.01em] truncate text-foreground">
              {title}
            </div>
            <div className="text-xs -mt-0.5 truncate text-muted">{artist}</div>
          </div>
        </div>
        <TransportControls
          isPlaying={isPlaying}
          disabled={!interactable}
          onPlayPause={togglePlay}
          onNext={onNext}
          onPrev={onPrev}
        />
        <SpeedControl playbackRate={playbackRate} />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileOptionsOpen(true)}
          disabled={!interactable}
          className="p-1.5"
        >
          <SlidersIcon className={iconClasses.sm} />
        </Button>
        <Button variant="ghost" size="sm" onClick={closePlayer} className="p-1.5">
          <CloseIcon className={iconClasses.sm} />
        </Button>
      </div>
      <Timeline
        current={current}
        total={duration}
        elapsed={elapsed}
        totalFormatted={total}
        setSeek={setSeek}
        disabled={!interactable}
        showVolumeControl={true}
        volume={volume}
        setVolume={setVolume}
      />
    </div>
  );
});

interface DesktopPlayerLayoutProps extends MobilePlayerLayoutProps {
  setDesktopOptionsOpen: (open: boolean) => void;
}

const DesktopPlayerLayout = React.memo(function DesktopPlayerLayout({
  cover,
  title,
  artist,
  current,
  duration,
  elapsed,
  total,
  interactable,
  isPlaying,
  volume,
  togglePlay,
  setSeek,
  onNext,
  onPrev,
  setVolume,
  playbackRate,
  setMobileOptionsOpen: setDesktopOptionsOpen,
  closePlayer,
}: DesktopPlayerLayoutProps): React.JSX.Element {
  return (
    <div className="hidden sm:flex items-center gap-4">
      <div className="flex-shrink-0">
        <Image
          src={cover}
          alt="cover"
          width={48}
          height={48}
          className="h-12 w-12 rounded-lg shadow-md object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><rect width='100%' height='100%' rx='8' ry='8' fill='%23e5e7eb'/></svg>";
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <TrackInfo title={title} artist={artist} />
        <div className="flex items-center gap-3">
          <div className="flex-1 max-w-md">
            <Timeline
              current={current}
              total={duration}
              elapsed={elapsed}
              totalFormatted={total}
              setSeek={setSeek}
              disabled={!interactable}
            />
          </div>
          <TransportControls
            isPlaying={isPlaying}
            disabled={!interactable}
            onPlayPause={togglePlay}
            onNext={onNext}
            onPrev={onPrev}
          />
          <SpeedControl playbackRate={playbackRate} />
          <PlayerOptions
            onOpenSettings={() => setDesktopOptionsOpen(true)}
            disabled={!interactable}
            showVolumeControl={true}
            volume={volume}
            setVolume={setVolume}
          />
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={closePlayer} className="p-1.5">
        <CloseIcon className={iconClasses.sm} />
      </Button>
    </div>
  );
});

function mmss(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

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
    closePlayer,
    audioRef,
    isPlaying,
    setIsPlaying,
    setPlayingId,
    activeVerse,
    volume,
    setVolume,
    playbackRate,
    repeatOptions,
  } = useAudio();
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState<number>(track?.durationSec ?? 0);
  const [mobileOptionsOpen, setMobileOptionsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'reciter' | 'repeat'>('reciter');

  const {
    audioRef: internalAudioRef,
    play,
    pause,
    seek,
    setVolume: setPlayerVolume,
    setPlaybackRate: setPlayerPlaybackRate,
  } = useAudioPlayer({
    src: track?.src,
    defaultDuration: track?.durationSec,
    onTimeUpdate: setCurrent,
    onLoadedMetadata: setDuration,
  });

  useEffect(() => {
    audioRef.current = internalAudioRef.current;
  }, [audioRef, internalAudioRef]);

  const interactable = Boolean(track?.src);

  useEffect(() => {
    setCurrent(0);
    setDuration(track?.durationSec ?? 0);
  }, [track?.src, track?.durationSec]);

  useEffect(() => {
    if (isPlaying) play();
    if (!isPlaying) pause();
  }, [isPlaying, play, pause]);

  useEffect(() => {
    setPlayerVolume(volume);
  }, [volume, setPlayerVolume]);

  useEffect(() => {
    setPlayerPlaybackRate(playbackRate);
  }, [playbackRate, setPlayerPlaybackRate]);

  const togglePlay = useCallback(() => {
    if (!interactable) return;
    const newPlaying = !isPlaying;
    setIsPlaying(newPlaying);
    if (newPlaying) {
      if (activeVerse) setPlayingId(activeVerse.id);
    } else {
      setPlayingId(null);
    }
  }, [activeVerse, interactable, isPlaying, setIsPlaying, setPlayingId]);

  const setSeek = useCallback(
    (sec: number) => {
      seek(sec);
    },
    [seek]
  );

  usePlayerKeyboard({ current, duration, setSeek, togglePlay, setVolume });

  const handleEnded = usePlaybackCompletion({
    audioRef: internalAudioRef,
    repeatOptions,
    activeVerse,
    onNext,
    onPrev,
    seek,
    play,
    pause,
    setIsPlaying,
    setPlayingId,
  });

  const elapsed = useMemo(() => mmss(current), [current]);
  const total = useMemo(() => mmss(duration || 0), [duration]);

  const title = track?.title ?? 'No track selected';
  const artist = track?.artist ?? '';
  const cover =
    track?.coverUrl ||
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><rect width='100%' height='100%' rx='12' ry='12' fill='%23e5e7eb'/><text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, system-ui, sans-serif' font-size='12' fill='%239ca3af'>No cover</text></svg>";

  if (!isPlayerVisible) return null;

  const playerLayoutProps = {
    cover,
    title,
    artist,
    current,
    duration,
    elapsed,
    total,
    interactable,
    isPlaying,
    volume,
    togglePlay,
    setSeek,
    onNext,
    onPrev,
    setVolume,
    playbackRate,
    setMobileOptionsOpen,
    closePlayer,
  };

  return (
    <div className="relative w-full">
      <div
        className="mx-auto w-full rounded-2xl px-3 py-3 sm:px-4 sm:py-4 bg-surface shadow-lg border border-border"
        role="region"
        aria-label="Player"
      >
        <MobilePlayerLayout {...playerLayoutProps} />
        <DesktopPlayerLayout {...playerLayoutProps} setDesktopOptionsOpen={setMobileOptionsOpen} />
      </div>
      <audio ref={internalAudioRef} src={track?.src || ''} preload="metadata" onEnded={handleEnded}>
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
