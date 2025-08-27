/**
 * React Hook: useAudioService
 *
 * Provides access to AudioService with React integration.
 * This replaces the need for the existing AudioContext pattern.
 */

import { useState, useCallback, useEffect } from 'react';
import { AudioService } from '../services/AudioService';
import { getServices } from '../ServiceContainer';
import {
  AudioSettings,
  RepeatOptions,
  AudioSettingsStorageData,
} from '../../domain/entities/AudioSettings';

export interface UseAudioServiceResult {
  // Current audio settings
  audioSettings: AudioSettings | null;
  loading: boolean;
  error: string | null;

  // Reciter settings
  setReciter: (reciterId: number) => Promise<void>;
  getCurrentReciterId: () => Promise<number>;

  // Volume settings
  setVolume: (volume: number) => Promise<void>;
  getCurrentVolume: () => Promise<number>;

  // Playback rate settings
  setPlaybackRate: (rate: number) => Promise<void>;
  getCurrentPlaybackRate: () => Promise<number>;

  // Repeat options
  setRepeatOptions: (options: RepeatOptions) => Promise<void>;
  getCurrentRepeatOptions: () => Promise<RepeatOptions>;

  // Last playing verse tracking
  setLastPlayingId: (id: number | undefined) => Promise<void>;
  getLastPlayingId: () => Promise<number | undefined>;

  // Bulk operations
  updateAudioSettings: (updates: Partial<AudioSettingsStorageData>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  refreshAudioSettings: () => Promise<void>;
}

export function useAudioService(): UseAudioServiceResult {
  const [audioSettings, setAudioSettings] = useState<AudioSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioService: AudioService = getServices().audioService;

  // Load initial audio settings
  const refreshAudioSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const currentSettings = await audioService.getAudioSettings();
      setAudioSettings(currentSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audio settings');
    } finally {
      setLoading(false);
    }
  }, [audioService]);

  // Initialize on mount
  useEffect(() => {
    refreshAudioSettings();
  }, [refreshAudioSettings]);

  // Reciter settings
  const setReciter = useCallback(
    async (reciterId: number) => {
      try {
        setError(null);
        await audioService.setReciter(reciterId);
        await refreshAudioSettings();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update reciter');
        throw err;
      }
    },
    [audioService, refreshAudioSettings]
  );

  const getCurrentReciterId = useCallback(async () => {
    try {
      return await audioService.getCurrentReciterId();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get reciter');
      throw err;
    }
  }, [audioService]);

  // Volume settings
  const setVolume = useCallback(
    async (volume: number) => {
      try {
        setError(null);
        await audioService.setVolume(volume);
        await refreshAudioSettings();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update volume');
        throw err;
      }
    },
    [audioService, refreshAudioSettings]
  );

  const getCurrentVolume = useCallback(async () => {
    try {
      return await audioService.getCurrentVolume();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get volume');
      throw err;
    }
  }, [audioService]);

  // Playback rate settings
  const setPlaybackRate = useCallback(
    async (rate: number) => {
      try {
        setError(null);
        await audioService.setPlaybackRate(rate);
        await refreshAudioSettings();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update playback rate');
        throw err;
      }
    },
    [audioService, refreshAudioSettings]
  );

  const getCurrentPlaybackRate = useCallback(async () => {
    try {
      return await audioService.getCurrentPlaybackRate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get playback rate');
      throw err;
    }
  }, [audioService]);

  // Repeat options
  const setRepeatOptions = useCallback(
    async (options: RepeatOptions) => {
      try {
        setError(null);
        await audioService.setRepeatOptions(options);
        await refreshAudioSettings();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update repeat options');
        throw err;
      }
    },
    [audioService, refreshAudioSettings]
  );

  const getCurrentRepeatOptions = useCallback(async () => {
    try {
      return await audioService.getCurrentRepeatOptions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get repeat options');
      throw err;
    }
  }, [audioService]);

  // Last playing verse tracking
  const setLastPlayingId = useCallback(
    async (id: number | undefined) => {
      try {
        setError(null);
        await audioService.setLastPlayingId(id);
        await refreshAudioSettings();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update last playing ID');
        throw err;
      }
    },
    [audioService, refreshAudioSettings]
  );

  const getLastPlayingId = useCallback(async () => {
    try {
      return await audioService.getLastPlayingId();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get last playing ID');
      throw err;
    }
  }, [audioService]);

  // Bulk operations
  const updateAudioSettings = useCallback(
    async (updates: Partial<AudioSettingsStorageData>) => {
      try {
        setError(null);
        await audioService.updateAudioSettings(updates);
        await refreshAudioSettings();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update audio settings');
        throw err;
      }
    },
    [audioService, refreshAudioSettings]
  );

  const resetToDefaults = useCallback(async () => {
    try {
      setError(null);
      await audioService.resetToDefaults();
      await refreshAudioSettings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset audio settings');
      throw err;
    }
  }, [audioService, refreshAudioSettings]);

  return {
    // State
    audioSettings,
    loading,
    error,

    // Reciter settings
    setReciter,
    getCurrentReciterId,

    // Volume settings
    setVolume,
    getCurrentVolume,

    // Playback rate settings
    setPlaybackRate,
    getCurrentPlaybackRate,

    // Repeat options
    setRepeatOptions,
    getCurrentRepeatOptions,

    // Last playing verse tracking
    setLastPlayingId,
    getLastPlayingId,

    // Bulk operations
    updateAudioSettings,
    resetToDefaults,
    refreshAudioSettings,
  };
}
