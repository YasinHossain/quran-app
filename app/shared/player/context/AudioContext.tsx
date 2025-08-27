'use client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Verse } from '@/types';
import { RECITERS } from '@/lib/audio/reciters';
import type { Reciter, RepeatOptions } from '@/app/shared/player/types';
import { useAudioService } from '@/src/application/hooks/useAudioService';

interface AudioContextType {
  playingId: number | null;
  setPlayingId: React.Dispatch<React.SetStateAction<number | null>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  loadingId: number | null;
  setLoadingId: React.Dispatch<React.SetStateAction<number | null>>;
  activeVerse: Verse | null;
  setActiveVerse: React.Dispatch<React.SetStateAction<Verse | null>>;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  repeatOptions: RepeatOptions;
  setRepeatOptions: React.Dispatch<React.SetStateAction<RepeatOptions>>;
  reciter: Reciter;
  setReciter: React.Dispatch<React.SetStateAction<Reciter>>;
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  playbackRate: number;
  setPlaybackRate: React.Dispatch<React.SetStateAction<number>>;
  isPlayerVisible: boolean;
  openPlayer: () => void;
  closePlayer: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

/**
 * Provides global audio playback state.
 * Wrap your application with this provider to share the currently
 * playing and loading audio identifiers across components.
 */
export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [activeVerse, setActiveVerse] = useState<Verse | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayerVisible, setPlayerVisible] = useState(true);

  const audioService = useAudioService();

  // Load settings from clean architecture service
  const [repeatOptions, setRepeatOptionsState] = useState<RepeatOptions>({
    mode: 'off',
    start: 1,
    end: 1,
    playCount: 1,
    repeatEach: 1,
    delay: 0,
  });
  const [reciter, setReciterState] = useState<Reciter>(RECITERS[0]);
  const [volume, setVolumeState] = useState(0.9);
  const [playbackRate, setPlaybackRateState] = useState(1);

  // Initialize settings from service
  useEffect(() => {
    const initializeSettings = async () => {
      if (!audioService.audioSettings) return;

      const settings = audioService.audioSettings;

      // Set repeat options
      setRepeatOptionsState(settings.repeatOptions);

      // Find and set reciter
      const foundReciter = RECITERS.find((r) => r.id === settings.reciterId);
      if (foundReciter) {
        setReciterState(foundReciter);
      }

      // Set volume and playback rate
      setVolumeState(settings.volume);
      setPlaybackRateState(settings.playbackRate);

      // Set last playing ID if available
      if (settings.lastPlayingId) {
        setPlayingId(settings.lastPlayingId);
      }
    };

    initializeSettings();
  }, [audioService.audioSettings]);

  // Wrapper functions that update both local state and service
  const setRepeatOptions = useCallback(
    async (options: RepeatOptions) => {
      setRepeatOptionsState(options);
      try {
        await audioService.setRepeatOptions(options);
      } catch (error) {
        console.error('Failed to save repeat options:', error);
      }
    },
    [audioService]
  );

  const setReciter = useCallback(
    async (newReciter: Reciter) => {
      setReciterState(newReciter);
      try {
        await audioService.setReciter(newReciter.id);
      } catch (error) {
        console.error('Failed to save reciter:', error);
      }
    },
    [audioService]
  );

  const setVolume = useCallback(
    async (newVolume: number) => {
      setVolumeState(newVolume);
      try {
        await audioService.setVolume(newVolume);
      } catch (error) {
        console.error('Failed to save volume:', error);
      }
    },
    [audioService]
  );

  const setPlaybackRate = useCallback(
    async (newRate: number) => {
      setPlaybackRateState(newRate);
      try {
        await audioService.setPlaybackRate(newRate);
      } catch (error) {
        console.error('Failed to save playback rate:', error);
      }
    },
    [audioService]
  );

  const openPlayer = useCallback(() => {
    setPlayerVisible(true);
  }, [setPlayerVisible]);

  const closePlayer = useCallback(async () => {
    setIsPlaying(false);
    setPlayingId(null);
    setActiveVerse(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayerVisible(false);

    // Clear last playing ID when player is closed
    try {
      await audioService.setLastPlayingId(undefined);
    } catch (error) {
      console.error('Failed to clear last playing ID:', error);
    }
  }, [audioService]);

  // Update last playing ID when playingId changes
  useEffect(() => {
    const updateLastPlayingId = async () => {
      try {
        await audioService.setLastPlayingId(playingId || undefined);
      } catch (error) {
        console.error('Failed to update last playing ID:', error);
      }
    };

    if (playingId !== null) {
      updateLastPlayingId();
    }
  }, [playingId, audioService]);

  const value = useMemo(
    () => ({
      playingId,
      setPlayingId,
      isPlaying,
      setIsPlaying,
      loadingId,
      setLoadingId,
      activeVerse,
      setActiveVerse,
      audioRef,
      repeatOptions,
      setRepeatOptions,
      reciter,
      setReciter,
      volume,
      setVolume,
      playbackRate,
      setPlaybackRate,
      isPlayerVisible,
      openPlayer,
      closePlayer,
    }),
    [
      playingId,
      isPlaying,
      loadingId,
      activeVerse,
      repeatOptions,
      reciter,
      volume,
      playbackRate,
      isPlayerVisible,
      openPlayer,
      closePlayer,
      setRepeatOptions,
      setReciter,
      setVolume,
      setPlaybackRate,
    ]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

/**
 * Hook for accessing audio playback state.
 * Use within components to read or update the current playing or
 * loading audio identifiers managed by `AudioProvider`.
 */
export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
};
