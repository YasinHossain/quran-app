'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useAudio } from '@/app/(features)/player/context/AudioContext';
import { useTheme } from '@/app/providers/ThemeContext';
import useAudioPlayer from '@/app/(features)/player/hooks/useAudioPlayer';
import TrackInfo from './components/TrackInfo';
import TransportControls from './components/TransportControls';
import Timeline from './components/Timeline';
import SpeedControl from './components/SpeedControl';
import VolumeControl from './components/VolumeControl';
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
  const { theme } = useTheme();
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

  const [verseRepeatsLeft, setVerseRepeatsLeft] = useState(repeatOptions.repeatEach ?? 1);
  const [playRepeatsLeft, setPlayRepeatsLeft] = useState(repeatOptions.playCount ?? 1);

  useEffect(() => {
    setVerseRepeatsLeft(repeatOptions.repeatEach ?? 1);
    setPlayRepeatsLeft(repeatOptions.playCount ?? 1);
  }, [activeVerse, repeatOptions.repeatEach, repeatOptions.playCount]);

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'reciter' | 'repeat'>('reciter');

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

  // Keyboard interactions
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest('input, textarea, [role=slider]')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'ArrowLeft') setSeek(Math.max(0, current - 5));
      if (e.key === 'ArrowRight') setSeek(Math.min(duration || 0, current + 5));
      if (e.key === 'ArrowUp') setVolume((v) => Math.min(1, round(v + 0.05)));
      if (e.key === 'ArrowDown') setVolume((v) => Math.max(0, round(v - 0.05)));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, duration, setSeek, togglePlay, setVolume]);

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
        className={`mx-auto w-full rounded-2xl px-4 py-4 flex items-center gap-4 ${
          theme === 'dark'
            ? 'bg-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] border-slate-700'
            : 'bg-white shadow-[0_10px_30px_rgba(2,6,23,0.06),0_1px_2px_rgba(2,6,23,0.04)] border-slate-200/80'
        } border`}
        role="region"
        aria-label="Player"
      >
        {/* Left media block */}
        <TrackInfo cover={cover} title={title} artist={artist} theme={theme} />

        {/* Transport controls */}
        <TransportControls
          isPlaying={isPlaying}
          interactable={interactable}
          onPrev={onPrev}
          onNext={onNext}
          togglePlay={togglePlay}
          theme={theme}
        />

        {/* Timeline & Time Labels */}
        <Timeline
          current={current}
          duration={duration}
          setSeek={setSeek}
          interactable={interactable}
          theme={theme}
          elapsed={elapsed}
          total={total}
        />

        {/* Utilities */}
        <div className="flex items-center gap-2">
          <SpeedControl theme={theme} />
          <VolumeControl theme={theme} />
          <IconBtn
            aria-label="Options"
            onClick={() => {
              setActiveTab('reciter');
              setOptionsOpen(true);
            }}
            theme={theme}
          >
            <SlidersHorizontal />
          </IconBtn>
          <IconBtn aria-label="Close player" onClick={closePlayer} theme={theme}>
            <X />
          </IconBtn>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={internalAudioRef}
        src={track?.src || ''}
        preload="metadata"
        onEnded={() => {
          const mode = repeatOptions.mode;
          const start = repeatOptions.start ?? 1;
          const end = repeatOptions.end ?? start;
          const delay = (repeatOptions.delay ?? 0) * 1000;
          const currentAyah = activeVerse
            ? parseInt(activeVerse.verse_key.split(':')[1], 10)
            : null;

          if (mode === 'single') {
            if (verseRepeatsLeft > 1) {
              setVerseRepeatsLeft(verseRepeatsLeft - 1);
              seek(0);
              play();
              return;
            }
            if (playRepeatsLeft > 1) {
              setPlayRepeatsLeft(playRepeatsLeft - 1);
              setVerseRepeatsLeft(repeatOptions.repeatEach ?? 1);
              seek(0);
              play();
              return;
            }
          }

          if (mode === 'range') {
            if (verseRepeatsLeft > 1) {
              setVerseRepeatsLeft(verseRepeatsLeft - 1);
              seek(0);
              play();
              return;
            }
            setVerseRepeatsLeft(repeatOptions.repeatEach ?? 1);
            if (currentAyah && currentAyah < end) {
              onNext?.();
              return;
            }
            if (playRepeatsLeft > 1) {
              setPlayRepeatsLeft(playRepeatsLeft - 1);
              const steps = end - start;
              setTimeout(() => {
                for (let i = 0; i < steps; i++) {
                  onPrev?.();
                }
              }, delay);
              return;
            }
          }

          const hasNext = onNext?.() ?? false;
          setTimeout(() => {
            if (!hasNext || !internalAudioRef.current?.src) {
              pause();
              setIsPlaying(false);
              setPlayingId(null);
            }
          }, 0);
        }}
      >
        <track kind="captions" />
      </audio>

      {/* Options Sheet (Reciter + Repeat) */}
      <PlaybackOptionsModal
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        theme={theme}
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

function round(n: number) {
  return Math.round(n * 100) / 100;
}
