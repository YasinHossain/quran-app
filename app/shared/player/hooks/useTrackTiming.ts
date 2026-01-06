import { useCallback, useEffect, useMemo, useState, MutableRefObject } from 'react';

import { formatTime } from '@/app/shared/player/utils/timeline';

import { useAudioPlayer } from './useAudioPlayer';

import type { Track } from '@/app/shared/player/types';

interface TrackMeta {
  title: string;
  artist: string;
  interactable: boolean;
}

function getTrackMeta(track?: Track | null): TrackMeta {
  if (!track) {
    return { title: 'No track selected', artist: '', interactable: false };
  }
  return {
    title: track.title ?? 'No track selected',
    artist: track.artist ?? '',
    interactable: Boolean(track.src),
  };
}

interface Opts {
  track?: Track | null;
  volume: number;
  playbackRate: number;
  contextRef: MutableRefObject<HTMLAudioElement | null>;
}

export interface TrackTimingReturn {
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
}

export function useTrackTiming({
  track,
  volume,
  playbackRate,
  contextRef,
}: Opts): TrackTimingReturn {
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(track?.durationSec ?? 0);

  const segment = useMemo(() => {
    const start = track?.segmentStartSec;
    const end = track?.segmentEndSec;
    if (typeof start !== 'number' || typeof end !== 'number') return null;
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
    return { start, end, duration: end - start };
  }, [track?.segmentStartSec, track?.segmentEndSec]);

  const handleTimeUpdate = useCallback(
    (timeSec: number): void => {
      if (!segment) {
        setCurrent(timeSec);
        return;
      }
      const relative = timeSec - segment.start;
      setCurrent(Math.max(0, Math.min(segment.duration, relative)));
    },
    [segment]
  );

  const handleLoadedMetadata = useCallback(
    (loadedDuration: number): void => {
      if (segment) {
        setDuration(segment.duration);
        return;
      }
      setDuration(loadedDuration);
    },
    [segment]
  );

  const playerOptions: {
    src?: string;
    defaultDuration?: number;
    onTimeUpdate?: (time: number) => void;
    onLoadedMetadata?: (duration: number) => void;
  } = {
    onTimeUpdate: handleTimeUpdate,
    onLoadedMetadata: handleLoadedMetadata,
  };
  if (track?.src !== undefined) playerOptions.src = track.src;
  if (track?.durationSec !== undefined) playerOptions.defaultDuration = track.durationSec;

  const {
    audioRef,
    play,
    pause,
    seek: rawSeek,
    setVolume,
    setPlaybackRate,
  } = useAudioPlayer(playerOptions);

  const seek = useCallback(
    (sec: number): void => {
      if (!segment) {
        rawSeek(sec);
        return;
      }
      const a = audioRef.current;
      if (!a) return;
      const clamped = Math.max(0, Math.min(segment.duration, sec));
      try {
        a.currentTime = segment.start + clamped;
      } catch {
        // ignore invalid seek states (e.g., before metadata is loaded)
      }
      setCurrent(clamped);
    },
    [audioRef, rawSeek, segment]
  );

  useEffect(() => {
    contextRef.current = audioRef.current;
  }, [contextRef, audioRef]);
  useEffect(() => {
    setCurrent(0);
    setDuration(segment?.duration ?? track?.durationSec ?? 0);
  }, [segment?.duration, track?.durationSec, track?.id, track?.src]);
  useEffect(() => {
    if (!segment) return;
    // Seek to start of segment when segment changes
    const a = audioRef.current;
    if (!a) return;
    try {
      // Check if we're already close to the start time (continuous playback)
      // If within 0.3s, don't seek to avoid audio hiccups
      const diff = Math.abs(a.currentTime - segment.start);
      if (diff > 0.3) {
        a.currentTime = segment.start;
        setCurrent(0);
      } else {
        // Just sync the internal state
        setCurrent(Math.max(0, a.currentTime - segment.start));
      }
    } catch {
      // ignore invalid seek states
    }
  }, [segment?.start, audioRef]);
  useEffect(() => {
    setVolume(volume);
    setPlaybackRate(playbackRate);
  }, [volume, playbackRate, setVolume, setPlaybackRate]);
  const elapsed = useMemo(() => formatTime(current), [current]);
  const total = useMemo(() => formatTime(duration || 0), [duration]);
  const { title, artist, interactable } = useMemo(() => getTrackMeta(track), [track]);
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
  };
}
