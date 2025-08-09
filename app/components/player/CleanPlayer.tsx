'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import * as Tooltip from '@radix-ui/react-tooltip';
import {
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Repeat,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Mic2,
} from 'lucide-react';

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
    { id: 'afasy', name: 'Mishary Al‑Afasy' },
    { id: 'husary', name: 'Mahmoud Khalil Al‑Husary' },
    { id: 'minshawi', name: 'Mohammad Al‑Minshawi' },
    { id: 'sudais', name: 'Abdul Rahman Al-Sudais' },
    { id: 'shuraim', name: 'Saud Al-Shuraim' },
    { id: 'ghamdi', name: 'Saad Al Ghamdi' },
  ],
  selectedReciterId,
  onReciterChange,
  repeatOptions,
  onRepeatChange,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(state?.isPlaying ?? false);
  const [current, setCurrent] = useState(state?.currentTimeSec ?? 0);
  const [duration, setDuration] = useState<number>(track?.durationSec ?? 0);
  const [volume, setVolume] = useState(state?.volume ?? 0.9);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const speedOptions = [0.75, 1, 1.25, 1.5, 2];

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

  return (
    <div className="relative w-full">
      {/* Card */}
      <div
        className="mx-auto w-full bg-white rounded-2xl shadow-[0_10px_30px_rgba(2,6,23,0.06),0_1px_2px_rgba(2,6,23,0.04)] border border-slate-200/80 px-4 py-4 flex items-center gap-4"
        role="region"
        aria-label="Player"
      >
        {/* Left media block */}
        <div className="flex items-center gap-3 min-w-0 sm:min-w-[220px] flex-shrink-0">
          <img
            src={cover}
            alt="cover"
            className="h-12 w-12 rounded-xl shadow-sm object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><rect width='100%' height='100%' rx='12' ry='12' fill='%23e5e7eb'/><text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, system-ui, sans-serif' font-size='12' fill='%239ca3af'>No cover</text></svg>";
            }}
          />
          <div className="min-w-0 hidden sm:block">
            <div
              className="text-sm font-semibold tracking-[-0.01em] text-slate-800 truncate"
              aria-label="current track title"
            >
              {title}
            </div>
            <div className="text-xs text-slate-500 -mt-0.5 truncate">{artist}</div>
          </div>
        </div>

        {/* Transport controls */}
        <div className="flex items-center gap-2">
          <IconBtn aria-label="Previous track" onClick={onPrev} disabled={!interactable}>
            <SkipBack />
          </IconBtn>
          <button
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={togglePlay}
            disabled={!interactable}
            className={
              'h-10 w-10 grid place-items-center rounded-full text-white hover:opacity-90 active:scale-95 transition ' +
              (interactable ? 'bg-[#0E2A47]' : 'bg-slate-300 cursor-not-allowed opacity-60')
            }
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <IconBtn aria-label="Next track" onClick={onNext} disabled={!interactable}>
            <SkipForward />
          </IconBtn>
        </div>

        {/* Timeline & Time Labels */}
        <div className="flex-1 flex items-center gap-3">
          <div className="flex-1">
            <Tooltip.Provider delayDuration={150}>
              <Slider.Root
                className={`relative w-full h-2.5 group flex items-center ${
                  !interactable ? 'opacity-60 pointer-events-none' : ''
                }`}
                value={[current]}
                max={Math.max(1, duration || 0)}
                step={0.1}
                onValueChange={([v]) => setSeek(v)}
                aria-label="Seek"
              >
                <Slider.Track className="bg-[rgba(14,42,71,0.18)] h-0.5 rounded-full relative w-full grow">
                  <Slider.Range className="bg-[#0E2A47] h-full rounded-full absolute" />
                </Slider.Track>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Slider.Thumb
                      className="block h-3 w-3 rounded-full bg-white ring-2 ring-[#0E2A47] shadow-[0_1px_2px_rgba(2,6,23,0.15)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0E2A47]/35"
                      aria-label="Position"
                    />
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      sideOffset={8}
                      className="rounded-md bg-slate-900 text-white text-xs px-2 py-1 shadow"
                    >
                      {elapsed}
                      <Tooltip.Arrow className="fill-slate-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Slider.Root>
            </Tooltip.Provider>
          </div>
          <div className="hidden md:flex min-w-[88px] justify-between text-[11px] text-slate-500 tabular-nums">
            <span aria-label="elapsed">{elapsed}</span>
            <span aria-label="duration">{total}</span>
          </div>
        </div>

        {/* Utilities */}
        <div className="flex items-center gap-2">
          {/* Playback Speed */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setSpeedMenuOpen((s) => !s)}
              className="h-9 w-14 grid place-items-center rounded-full text-xs font-bold text-[#0E2A47]/80 transition focus:outline-none focus:ring-2 focus:ring-[#0E2A47]/35 hover:bg-slate-900/5"
            >
              {playbackRate}x
            </button>
            {speedMenuOpen && (
              <div
                className="absolute bottom-full mb-2 w-28 bg-white rounded-lg shadow-lg border border-slate-200 p-1"
                onMouseLeave={() => setSpeedMenuOpen(false)}
              >
                {speedOptions.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => {
                      setPlaybackRate(speed);
                      setSpeedMenuOpen(false);
                    }}
                    className={`w-full text-center text-sm p-1.5 rounded-md ${playbackRate === speed ? 'bg-[#0E2A47] text-white' : 'hover:bg-slate-100'}`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Volume */}
          <div className="hidden lg:flex items-center gap-2 w-28">
            {volume === 0 ? (
              <VolumeX className="opacity-80 text-slate-600" />
            ) : (
              <Volume2 className="opacity-80 text-slate-600" />
            )}
            <Slider.Root
              className="relative w-full h-2.5 group flex items-center"
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={([v]) => {
                setVolume(v);
                onVolume?.(v);
              }}
              aria-label="Volume"
            >
              <Slider.Track className="h-0.5 rounded-full bg-[rgba(14,42,71,0.2)] relative w-full grow">
                <Slider.Range className="h-full rounded-full bg-[#0E2A47] absolute" />
              </Slider.Track>
              <Slider.Thumb className="block h-3 w-3 rounded-full bg-white ring-2 ring-[#0E2A47] focus:outline-none" />
            </Slider.Root>
          </div>
          <IconBtn
            aria-label="Options"
            onClick={() => {
              setActiveTab('reciter');
              setOptionsOpen(true);
            }}
          >
            <SlidersHorizontal />
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
      {optionsOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onClick={() => setOptionsOpen(false)}
          onKeyDown={(e) => e.key === 'Enter' && setOptionsOpen(false)}
          role="button"
          tabIndex={0}
        >
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <div
            className="w-full max-w-3xl rounded-2xl bg-white border border-transparent shadow-[0_10px_30px_rgba(2,6,23,0.12),0_1px_2px_rgba(2,6,23,0.06)] p-4 md:p-6"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-[#0E2A47]/10 text-[#0E2A47] grid place-items-center">
                <SlidersHorizontal />
              </div>
              <div className="font-semibold">Playback Options</div>
              <button
                className="ml-auto text-slate-500 hover:text-slate-900"
                onClick={() => setOptionsOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setActiveTab('reciter')}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  activeTab === 'reciter'
                    ? 'bg-[#0E2A47]/10 text-[#0E2A47]'
                    : 'hover:bg-slate-900/5'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Mic2 className="h-4 w-4" />
                  Reciter
                </span>
              </button>
              <button
                onClick={() => setActiveTab('repeat')}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  activeTab === 'repeat' ? 'bg-[#0E2A47]/10 text-[#0E2A47]' : 'hover:bg-slate-900/5'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Repeat className="h-4 w-4" />
                  Verse Repeat
                </span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Reciter list */}
              {activeTab === 'reciter' && (
                <div className="md:col-span-2">
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-auto pr-1">
                    {reciters.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setLocalReciter(r.id)}
                        className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition ${
                          localReciter === r.id
                            ? 'border-[#0E2A47] bg-[#0E2A47]/5'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{r.name}</div>
                          {r.locale && <div className="text-xs text-slate-500">{r.locale}</div>}
                        </div>
                        <div
                          className={`h-4 w-4 rounded-full ${
                            localReciter === r.id ? 'bg-[#0E2A47]' : 'border border-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Repeat panel */}
              {activeTab === 'repeat' && (
                <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="font-medium mb-3">Mode</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['off', 'single', 'range', 'surah'] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setLocalRepeat({ ...localRepeat, mode: m })}
                          className={`px-3 py-2 rounded-xl text-sm capitalize ${
                            localRepeat.mode === m
                              ? 'bg-[#0E2A47] text-white'
                              : 'bg-slate-50 hover:bg-slate-100'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4 grid grid-cols-2 gap-3">
                    <NumberField
                      label="Start"
                      value={localRepeat.start ?? 1}
                      min={1}
                      onChange={(v) => setLocalRepeat({ ...localRepeat, start: v })}
                    />
                    <NumberField
                      label="End"
                      value={localRepeat.end ?? localRepeat.start ?? 1}
                      min={localRepeat.start ?? 1}
                      onChange={(v) => setLocalRepeat({ ...localRepeat, end: v })}
                    />
                    <NumberField
                      label="Play count"
                      value={localRepeat.playCount ?? 1}
                      min={1}
                      onChange={(v) => setLocalRepeat({ ...localRepeat, playCount: v })}
                    />
                    <NumberField
                      label="Repeat each"
                      value={localRepeat.repeatEach ?? 1}
                      min={1}
                      onChange={(v) => setLocalRepeat({ ...localRepeat, repeatEach: v })}
                    />
                    <div className="col-span-2">
                      <NumberField
                        label="Delay (s)"
                        value={localRepeat.delay ?? 0}
                        min={0}
                        onChange={(v) => setLocalRepeat({ ...localRepeat, delay: v })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between text-sm">
              <div className="text-slate-500">Tips: Space • ←/→ seek • ↑/↓ volume</div>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
                  onClick={() => setOptionsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-xl bg-[#0E2A47] text-white hover:opacity-90"
                  onClick={commitOptions}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, className = '', disabled, ...rest }: React.ComponentProps<'button'>) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={
        'h-9 w-9 grid place-items-center rounded-full text-[#0E2A47]/80 transition focus:outline-none focus:ring-2 focus:ring-[#0E2A47]/35 ' +
        (disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:text-[#0E2A47] hover:-translate-y-px active:scale-95 hover:bg-slate-900/5 active:bg-slate-900/10') +
        ' ' +
        className
      }
    >
      <span className="[&>*]:h-[18px] [&>*]:w-[18px] [&>*]:stroke-[1.75]">{children}</span>
    </button>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min = 0,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <label className="text-sm">
      <span className="block mb-1 text-slate-600">{label}</span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0E2A47]/35"
      />
    </label>
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
