/**
 * React Hook: useSettingsService
 *
 * Provides access to SettingsService with React integration.
 * This replaces the need for the existing SettingsContext pattern.
 */

import { useState, useCallback, useEffect } from 'react';
import { SettingsService } from '../services/SettingsService';
import { getServices } from '../ServiceContainer';
import { Settings, ArabicFont, SettingsStorageData } from '../../domain/entities/Settings';

export interface UseSettingsServiceResult {
  // Current settings
  settings: Settings | null;
  loading: boolean;
  error: string | null;

  // Translation settings
  setTranslationIds: (ids: number[]) => Promise<void>;
  addTranslation: (id: number) => Promise<void>;
  removeTranslation: (id: number) => Promise<void>;

  // Tafsir settings
  setTafsirIds: (ids: number[]) => Promise<void>;
  addTafsir: (id: number) => Promise<void>;
  removeTafsir: (id: number) => Promise<void>;

  // Display settings
  setArabicFont: (font: string) => Promise<void>;
  setFontSize: (size: number) => Promise<void>;
  increaseFontSize: () => Promise<void>;
  decreaseFontSize: () => Promise<void>;

  // Reading preferences
  setShowByWords: (show: boolean) => Promise<void>;
  toggleShowByWords: () => Promise<boolean>;
  setTajweed: (enabled: boolean) => Promise<void>;
  toggleTajweed: () => Promise<boolean>;

  // Word translation settings
  setWordLang: (lang: string) => Promise<void>;
  setWordTranslationId: (id: number) => Promise<void>;

  // Theme settings
  setTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;

  // Bulk operations
  updateSettings: (updates: Partial<SettingsStorageData>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  refreshSettings: () => Promise<void>;

  // Utility
  getAvailableArabicFonts: () => Promise<ArabicFont[]>;
}

export function useSettingsService(): UseSettingsServiceResult {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const settingsService: SettingsService = getServices().settingsService;

  // Load initial settings
  const refreshSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const currentSettings = await settingsService.getSettings();
      setSettings(currentSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, [settingsService]);

  // Initialize on mount
  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  // Translation settings
  const setTranslationIds = useCallback(
    async (ids: number[]) => {
      try {
        setError(null);
        await settingsService.setTranslationIds(ids);
        await refreshSettings();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update translation IDs');
        throw err;
      }
    },
    [settingsService, refreshSettings]
  );

  const addTranslation = useCallback(
    async (id: number) => {
      try {
        setError(null);
        await settingsService.addTranslation(id);
        await refreshSettings();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add translation');
        throw err;
      }
    },
    [settingsService, refreshSettings]
  );

  const removeTranslation = useCallback(
    async (id: number) => {
      try {
        setError(null);
        await settingsService.removeTranslation(id);
        await refreshSettings();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove translation');
        throw err;
      }
    },
    [settingsService, refreshSettings]
  );

  // Tafsir settings
  const setTafsirIds = useCallback(
    async (ids: number[]) => {
      try {
        setError(null);
        await settingsService.setTafsirIds(ids);
        await refreshSettings();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update tafsir IDs');
        throw err;
      }
    },
    [settingsService, refreshSettings]
  );

  const addTafsir = useCallback(
    async (id: number) => {
      try {
        setError(null);
        await settingsService.addTafsir(id);
        await refreshSettings();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add tafsir');
        throw err;
      }
    },
    [settingsService, refreshSettings]
  );

  const removeTafsir = useCallback(
    async (id: number) => {
      try {
        setError(null);
        await settingsService.removeTafsir(id);
        await refreshSettings();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove tafsir');
        throw err;
      }
    },
    [settingsService, refreshSettings]
  );

  // Display settings
  const setArabicFont = useCallback(
    async (font: string) => {
      try {
        setError(null);
        await settingsService.setArabicFont(font);
        await refreshSettings();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update Arabic font');
        throw err;
      }
    },
    [settingsService, refreshSettings]
  );

  const setFontSize = useCallback(
    async (size: number) => {
      try {
        setError(null);
        await settingsService.setFontSize(size);
        await refreshSettings();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update font size');
        throw err;
      }
    },
    [settingsService, refreshSettings]
  );

  const increaseFontSize = useCallback(async () => {
    try {
      setError(null);
      await settingsService.increaseFontSize();
      await refreshSettings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to increase font size');
      throw err;
    }
  }, [settingsService, refreshSettings]);

  const decreaseFontSize = useCallback(async () => {
    try {
      setError(null);
      await settingsService.decreaseFontSize();
      await refreshSettings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decrease font size');
      throw err;
    }
  }, [settingsService, refreshSettings]);

  // Reading preferences
  const setShowByWords = useCallback(
    async (show: boolean) => {
      try {
        setError(null);
        await settingsService.setShowByWords(show);
        await refreshSettings();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update show by words');
        throw err;
      }
    },
    [settingsService, refreshSettings]
  );

  const toggleShowByWords = useCallback(async () => {
    try {
      setError(null);
      const result = await settingsService.toggleShowByWords();
      await refreshSettings();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle show by words');
      throw err;
    }
  }, [settingsService, refreshSettings]);

  const setTajweed = useCallback(
    async (enabled: boolean) => {
      try {
        setError(null);
        await settingsService.setTajweed(enabled);
        await refreshSettings();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update tajweed');
        throw err;
      }
    },
    [settingsService, refreshSettings]
  );

  const toggleTajweed = useCallback(async () => {
    try {
      setError(null);
      const result = await settingsService.toggleTajweed();
      await refreshSettings();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle tajweed');
      throw err;
    }
  }, [settingsService, refreshSettings]);

  // Word translation settings
  const setWordLang = useCallback(
    async (lang: string) => {
      try {
        setError(null);
        await settingsService.setWordLang(lang);
        await refreshSettings();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update word language');
        throw err;
      }
    },
    [settingsService, refreshSettings]
  );

  const setWordTranslationId = useCallback(
    async (id: number) => {
      try {
        setError(null);
        await settingsService.setWordTranslationId(id);
        await refreshSettings();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update word translation ID');
        throw err;
      }
    },
    [settingsService, refreshSettings]
  );

  // Theme settings
  const setTheme = useCallback(
    async (theme: 'light' | 'dark' | 'system') => {
      try {
        setError(null);
        await settingsService.setTheme(theme);
        await refreshSettings();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update theme');
        throw err;
      }
    },
    [settingsService, refreshSettings]
  );

  // Bulk operations
  const updateSettings = useCallback(
    async (updates: Partial<SettingsStorageData>) => {
      try {
        setError(null);
        await settingsService.updateSettings(updates);
        await refreshSettings();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update settings');
        throw err;
      }
    },
    [settingsService, refreshSettings]
  );

  const resetToDefaults = useCallback(async () => {
    try {
      setError(null);
      await settingsService.resetToDefaults();
      await refreshSettings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset settings');
      throw err;
    }
  }, [settingsService, refreshSettings]);

  // Utility
  const getAvailableArabicFonts = useCallback(async () => {
    try {
      return await settingsService.getAvailableArabicFonts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get Arabic fonts');
      return [];
    }
  }, [settingsService]);

  return {
    // State
    settings,
    loading,
    error,

    // Translation settings
    setTranslationIds,
    addTranslation,
    removeTranslation,

    // Tafsir settings
    setTafsirIds,
    addTafsir,
    removeTafsir,

    // Display settings
    setArabicFont,
    setFontSize,
    increaseFontSize,
    decreaseFontSize,

    // Reading preferences
    setShowByWords,
    toggleShowByWords,
    setTajweed,
    toggleTajweed,

    // Word translation settings
    setWordLang,
    setWordTranslationId,

    // Theme settings
    setTheme,

    // Bulk operations
    updateSettings,
    resetToDefaults,
    refreshSettings,

    // Utility
    getAvailableArabicFonts,
  };
}
