'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useAudio } from '@/app/context/AudioContext';
import { useTheme } from '@/app/context/ThemeContext';
import TrackInfo from './components/TrackInfo';
import TransportControls from './components/TransportControls';
import Timeline from './components/Timeline';
import SpeedControl from './components/SpeedControl';
import VolumeControl from './components/VolumeControl';
import PlaybackOptionsModal from './components/PlaybackOptionsModal';
import IconBtn from './components/IconBtn';

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

export type Track = {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  durationSec: number;
  src: string;
};

export type PlayerState = {
  currentTimeSec: number;
  isPlaying: boolean;
  volume: number; // 0..1
  isShuffle: boolean;
  repeatMode: 'off' | 'one' | 'all';
};

export type Reciter = { id: string; name: string; locale?: string };

export type RepeatOptions = {
  mode: 'off' | 'single' | 'range' | 'surah';
  start?: number;
  end?: number;
  playCount?: number;
  repeatEach?: number;
  delay?: number;
};

type Props = {
  track?: Track | null;
  state?: Partial<PlayerState>;
  onPrev?: () => void;
  onNext?: () => void;
  onTogglePlay?: (playing: boolean) => void;
  onSeek?: (sec: number) => void;
  onVolume?: (vol: number) => void;
  // Quran specific
  reciters?: Reciter[];
  selectedReciterId?: string;
  onReciterChange?: (id: string) => void;
  repeatOptions?: RepeatOptions;
  onRepeatChange?: (opts: RepeatOptions) => void;
};

export default function CleanPlayer({
  track,
  state,
  onPrev,
  onNext,
  onTogglePlay,
  onSeek,
  onVolume,
  reciters = [
    { id: 'afasy', name: 'Mishary Al-Afasy' },
    { id: 'husary', name: 'Mahmoud Khalil Al-Husary' },
    { id: 'minshawi', name: 'Mohammad Al-Minshawi' },
    { id: 'sudais', name: 'Abdul Rahman Al-Sudais' },
    { id: 'shuraim', name: 'Saud Al-Shuraim' },
    { id: 'ghamdi', name: 'Saad Al Ghamdi' },
  ],
  selectedReciterId,
  onReciterChange,
  repeatOptions,
  onRepeatChange,
}: Props) {
  const { theme } = useTheme();
  const { isPlayerVisible, closePlayer } = useAudio();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(state?.isPlaying ?? false);
  const [current, setCurrent] = useState(state?.currentTimeSec ?? 0);
  const [duration, setDuration] = useState<number>(track?.durationSec ?? 0);
  const [volume, setVolume] = useState(state?.volume ?? 0.9);
  const [playbackRate, setPlaybackRate] = useState(1);

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'reciter' | 'repeat'>('reciter');
  // local mirrors
  const [localReciter, setLocalReciter] = useState<string>(
    selectedReciterId ?? reciters[0]?.id ?? ''
  );
  const [localRepeat, setLocalRepeat] = useState<RepeatOptions>(
    repeatOptions ?? {
      mode: 'single',
      start: 1,
      end: 1,
      playCount: 1,
      repeatEach: 1,
      delay: 0,
    }
  );

  const interactable = Boolean(track?.src);

  // Sync with parent state
  useEffect(() => {
    if (state?.isPlaying !== undefined) {
      setIsPlaying(state.isPlaying);
    }
  }, [state?.isPlaying]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) {
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  }, [isPlaying, track?.src]);

  // Sync audio element volume
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;
  }, [volume]);

  // Sync audio element playback rate
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.playbackRate = playbackRate;
  }, [playbackRate]);

  // Wire up time/metadata listeners. Guard against missing track.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setCurrent(a.currentTime || 0);
    const onMeta = () => setDuration((a.duration || track?.durationSec || 0) as number);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    onMeta();
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onMeta);
    };
  }, [track?.src, track?.durationSec]);

  const togglePlay = useCallback(() => {
    if (!interactable) return;
    const newPlaying = !isPlaying;
    setIsPlaying(newPlaying);
    onTogglePlay?.(newPlaying);
  }, [interactable, isPlaying, onTogglePlay]);

  const setSeek = useCallback(
    (sec: number) => {
      const a = audioRef.current;
      if (!a) return;
      const max = a.duration || duration || 0;
      a.currentTime = Math.max(0, Math.min(max, sec));
      setCurrent(a.currentTime || 0);
      onSeek?.(a.currentTime || 0);
    },
    [duration, onSeek]
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
  }, [current, duration, interactable, isPlaying, setSeek, togglePlay]);

  const elapsed = useMemo(() => mmss(current), [current]);
  const total = useMemo(() => mmss(duration || 0), [duration]);

  const title = track?.title ?? 'No track selected';
  const artist = track?.artist ?? '';
  const cover =
    track?.coverUrl ??
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><rect width='100%' height='100%' rx='12' ry='12' fill='%23e5e7eb'/><text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, system-ui, sans-serif' font-size='12' fill='%239ca3af'>No cover</text></svg>";

  // when options modal closes, commit selections outward
  const commitOptions = () => {
    onReciterChange?.(localReciter);
    onRepeatChange?.(localRepeat);
    setOptionsOpen(false);
  };

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
          <SpeedControl
            playbackRate={playbackRate}
            setPlaybackRate={setPlaybackRate}
            theme={theme}
          />
          <VolumeControl volume={volume} setVolume={setVolume} onVolume={onVolume} theme={theme} />
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
        ref={audioRef}
        src={track?.src || ''}
        preload="metadata"
        onEnded={() => {
          // Basic repeat functionality can be handled in the parent via onNext
          onNext?.();
          setIsPlaying(false);
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
        reciters={reciters}
        localReciter={localReciter}
        setLocalReciter={setLocalReciter}
        localRepeat={localRepeat}
        setLocalRepeat={setLocalRepeat}
        commitOptions={commitOptions}
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
