import { useEffect, useMemo, useState, MutableRefObject } from 'react';

import { formatTime } from '@/app/shared/player/utils/timeline';

import { useAudioPlayer } from './useAudioPlayer';

import type { Track } from '@/app/shared/player/types';

const DEFAULT_COVER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><rect width='100%' height='100%' rx='12' ry='12' fill='%23e5e7eb'/><text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, system-ui, sans-serif' font-size='12' fill='%239ca3af'>No cover</text></svg>";

function getTrackMeta(track?: Track | null): {
  title: string;
  artist: string;
  cover: string;
  interactable: boolean;
} {
  if (!track) {
    return { title: 'No track selected', artist: '', cover: DEFAULT_COVER, interactable: false };
  }
  return {
    title: track.title ?? 'No track selected',
    artist: track.artist ?? '',
    cover: track.coverUrl || DEFAULT_COVER,
    interactable: Boolean(track.src),
  } as const;
}

interface Opts {
  track?: Track | null;
  volume: number;
  playbackRate: number;
  contextRef: MutableRefObject<HTMLAudioElement | null>;
}

interface TrackTimingReturn {
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  play: () => void;
  pause: () => void;
  seek: (sec: number) => void;
  current: number;
  duration: number;
  elapsed: string;
  total: string;
  interactable: boolean;
  title: string;
  artist: string;
  cover: string;
}

export function useTrackTiming({
  track,
  volume,
  playbackRate,
  contextRef,
}: Opts): TrackTimingReturn {
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(track?.durationSec ?? 0);
  const { audioRef, play, pause, seek, setVolume, setPlaybackRate } = useAudioPlayer({
    src: track?.src,
    defaultDuration: track?.durationSec,
    onTimeUpdate: setCurrent,
    onLoadedMetadata: setDuration,
  });
  useEffect(() => {
    contextRef.current = audioRef.current;
  }, [contextRef, audioRef]);
  useEffect(() => {
    setCurrent(0);
    setDuration(track?.durationSec ?? 0);
  }, [track?.src, track?.durationSec]);
  useEffect(() => {
    setVolume(volume);
    setPlaybackRate(playbackRate);
  }, [volume, playbackRate, setVolume, setPlaybackRate]);
  const elapsed = useMemo(() => formatTime(current), [current]);
  const total = useMemo(() => formatTime(duration || 0), [duration]);
  const { title, artist, cover, interactable } = useMemo(() => getTrackMeta(track), [track]);
  return {
    audioRef,
    play,
    pause,
    seek,
    current,
    duration,
    elapsed,
    total,
    interactable,
    title,
    artist,
    cover,
  } as const;
}
