import { useState, Dispatch, SetStateAction, RefObject } from 'react';

import { useAudio } from '@/app/shared/player/context/AudioContext';

import { usePlaybackCompletion } from './usePlaybackCompletion';
import { usePlayerControls } from './usePlayerControls';
import { useTrackTiming } from './useTrackTiming';

import type { Track } from '../types';

interface Props {
  track?: Track | null;
  onPrev?: () => boolean;
  onNext?: () => boolean;
}

interface QuranAudioControllerReturn {
  isPlayerVisible: boolean;
  audioRef: RefObject<HTMLAudioElement>;
  handleEnded: () => void;
  playerLayoutProps: {
    cover: string;
    title: string;
    artist: string;
    current: number;
    duration: number;
    elapsed: string;
    total: string;
    interactable: boolean;
    isPlaying: boolean;
    togglePlay: () => void;
    setSeek: (value: number) => void;
    onNext?: () => boolean;
    onPrev?: () => boolean;
    closePlayer: () => void;
    setMobileOptionsOpen: () => void;
  };
  mobileOptionsOpen: boolean;
  setMobileOptionsOpen: Dispatch<SetStateAction<boolean>>;
  activeTab: 'reciter' | 'repeat';
  setActiveTab: Dispatch<SetStateAction<'reciter' | 'repeat'>>;
}

export function useQuranAudioController({
  track,
  onPrev,
  onNext,
}: Props): QuranAudioControllerReturn {
  const [mobileOptionsOpen, setMobileOptionsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'reciter' | 'repeat'>('reciter');

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
    togglePlay: controls.togglePlay,
    setSeek: controls.setSeek,
    onNext,
    onPrev,
    closePlayer,
    setMobileOptionsOpen: () => setMobileOptionsOpen(true),
  } as const;

  return {
    isPlayerVisible,
    audioRef: timing.audioRef,
    handleEnded,
    playerLayoutProps,
    mobileOptionsOpen,
    setMobileOptionsOpen,
    activeTab,
    setActiveTab,
  } as const;
}
