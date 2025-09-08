import { useState, Dispatch, SetStateAction, RefObject } from 'react';

import { useAudio } from '@/app/shared/player/context/AudioContext';
import { buildPlayerLayoutProps } from '@/app/shared/player/utils/buildPlayerLayoutProps';

import { useAudioControllerSetup } from './useAudioControllerSetup';
import { useTrackTiming } from './useTrackTiming';

import type { Track } from '@/app/shared/player/types';

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
  const { controls, handleEnded } = useAudioControllerSetup({
    timing,
    isPlaying,
    setIsPlaying,
    setPlayingId,
    activeVerse,
    setVolume,
    repeatOptions,
    onNext,
    onPrev,
  });
  const playerLayoutProps = buildPlayerLayoutProps({
    timing,
    isPlaying,
    onNext,
    onPrev,
    closePlayer,
    setMobileOptionsOpen,
    controls,
  });
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
