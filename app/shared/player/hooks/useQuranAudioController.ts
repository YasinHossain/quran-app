import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAudio } from '@/app/shared/player/context/AudioContext';

import { useAudioPlayer } from './useAudioPlayer';
import { usePlaybackCompletion } from './usePlaybackCompletion';
import { usePlayerKeyboard } from './usePlayerKeyboard';

import type { Track } from '../types';

interface UseQuranAudioControllerProps {
  track?: Track | null;
  onPrev?: () => boolean;
  onNext?: () => boolean;
}

function mmss(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function useQuranAudioController({ track, onPrev, onNext }: UseQuranAudioControllerProps) {
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
    closePlayer,
  } as const;

  return {
    isPlayerVisible,
    audioRef: internalAudioRef,
    handleEnded,
    playerLayoutProps,
  } as const;
}
