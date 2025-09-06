import { useAudio } from '@/app/shared/player/context/AudioContext';
import { useTrackTiming } from './useTrackTiming';
import { usePlayerControls } from './usePlayerControls';
import { usePlaybackCompletion } from './usePlaybackCompletion';
import type { Track } from '../types';

interface Props {
  track?: Track | null;
  onPrev?: () => boolean;
  onNext?: () => boolean;
}

export function useQuranAudioController({ track, onPrev, onNext }: Props) {
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

  const timing = useTrackTiming({ track, volume, playbackRate, contextRef: audioRef });

  const controls = usePlayerControls({
    interactable: timing.interactable,
    isPlaying,
    setIsPlaying,
    setPlayingId,
    activeVerse,
    current: timing.current,
    duration: timing.duration,
    seek: timing.seek,
    setVolume,
    play: timing.play,
    pause: timing.pause,
  });

  const handleEnded = usePlaybackCompletion({
    audioRef: timing.audioRef,
    repeatOptions,
    activeVerse,
    onNext,
    onPrev,
    seek: timing.seek,
    play: timing.play,
    pause: timing.pause,
    setIsPlaying,
    setPlayingId,
  });

  const playerLayoutProps = {
    cover: timing.cover,
    title: timing.title,
    artist: timing.artist,
    current: timing.current,
    duration: timing.duration,
    elapsed: timing.elapsed,
    total: timing.total,
    interactable: timing.interactable,
    isPlaying,
    volume,
    togglePlay: controls.togglePlay,
    setSeek: controls.setSeek,
    onNext,
    onPrev,
    setVolume,
    playbackRate,
    closePlayer,
  } as const;

  return {
    isPlayerVisible,
    audioRef: timing.audioRef,
    handleEnded,
    playerLayoutProps,
  } as const;
}
