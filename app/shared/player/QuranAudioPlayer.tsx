'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';
import { useAudio } from '@/app/shared/player/context/AudioContext';
import useAudioPlayer from '@/app/shared/player/hooks/useAudioPlayer';
import usePlayerKeyboard from '@/app/shared/player/hooks/usePlayerKeyboard';
import usePlaybackCompletion from '@/app/shared/player/hooks/usePlaybackCompletion';
import TrackInfo from './components/TrackInfo';
import TransportControls from './components/TransportControls';
import Timeline from './components/Timeline';
import PlayerOptions from './components/PlayerOptions';
import SpeedControl from './components/SpeedControl';
import PlaybackOptionsModal from './components/PlaybackOptionsModal';
import IconBtn from './components/IconBtn';
import type { Track } from './types';

/**
 * Clean minimal music/Quran player – Tailwind CSS + Next.js + TypeScript
 *
 * FIX: Guarded against undefined/null `track` to resolve
 * `TypeError: Cannot read properties of undefined (reading 'durationSec')`.
 * - `track` prop is optional.
 * - All reads use optional chaining + fallbacks.
 * - Disabled/skeleton state when no track is provided.
 * - Effects & sliders handle 0-duration safely.
 *
 * NEW (Quran features in same design language):
 * - Options sheet with two tabs: Reciter list & Verse Repeat.
 * - Reciter grid with radio selection.
 * - Repeat modes: off / single verse / range (A–B) / surah, with play count, repeat each, delay.
 * - ADDED: Playback speed control directly in the player bar.
 * - REMOVED: Shuffle and Repeat icons from main bar for a cleaner look.
 */

type Props = {
  track?: Track | null;
  onPrev?: () => boolean;
  onNext?: () => boolean;
};

export default function QuranAudioPlayer({ track, onPrev, onNext }: Props) {
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

  return (
    <div className="relative w-full">
      {/* Card */}
      <div
        className="mx-auto w-full rounded-2xl px-3 py-3 sm:px-4 sm:py-4 bg-surface shadow-lg border border-border"
        role="region"
        aria-label="Player"
      >
        {/* Mobile Layout */}
        <div className="flex flex-col gap-3 sm:hidden">
          {/* Main row: Verse info + Transport controls + Speed & Settings + Close */}
          <div className="flex items-center justify-between gap-2">
            {/* Left: Verse info (responsive icon) */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Show icon only on larger mobile screens */}
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
            {/* Center: Transport controls */}
            <TransportControls
              isPlaying={isPlaying}
              interactable={interactable}
              onPrev={onPrev}
              onNext={onNext}
              togglePlay={togglePlay}
            />
            {/* Right: Speed, Settings, and Close */}
            <div className="flex items-center gap-1">
              <SpeedControl />
              <IconBtn
                className="shrink-0"
                aria-label="Options"
                onClick={() => {
                  setActiveTab('reciter');
                  setMobileOptionsOpen(true);
                }}
              >
                <SlidersHorizontal />
              </IconBtn>
              <IconBtn aria-label="Close player" onClick={closePlayer}>
                <X />
              </IconBtn>
            </div>
          </div>
          {/* Bottom row: Timeline */}
          <Timeline
            current={current}
            duration={duration}
            setSeek={setSeek}
            interactable={interactable}
            elapsed={elapsed}
            total={total}
          />
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center gap-4">
          {/* Left media block */}
          <TrackInfo cover={cover} title={title} artist={artist} />
          {/* Transport controls */}
          <TransportControls
            isPlaying={isPlaying}
            interactable={interactable}
            onPrev={onPrev}
            onNext={onNext}
            togglePlay={togglePlay}
          />
          {/* Timeline & Time Labels */}
          <Timeline
            current={current}
            duration={duration}
            setSeek={setSeek}
            interactable={interactable}
            elapsed={elapsed}
            total={total}
          />
          {/* Utilities */}
          <div className="flex items-center gap-2">
            <PlayerOptions />
            <IconBtn aria-label="Close player" onClick={closePlayer}>
              <X />
            </IconBtn>
          </div>
        </div>
      </div>
      {/* Hidden audio element */}
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

function mmss(t: number) {
  t = Math.max(0, Math.floor(t || 0));
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
