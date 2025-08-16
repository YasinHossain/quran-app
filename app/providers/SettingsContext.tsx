'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { Settings } from '@/types';
import { ARABIC_FONTS, defaultSettings, loadSettings, saveSettings } from './settingsStorage';
import { reducer } from './settingsReducer';

// Debounce interval for persisting to localStorage.
// Shorter intervals save sooner but risk more writes; longer ones delay persistence.
const PERSIST_DEBOUNCE_MS = 300;

interface SettingsContextType {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  arabicFonts: { name: string; value: string; category: string }[];
  setShowByWords: (val: boolean) => void;
  setTajweed: (val: boolean) => void;
  setWordLang: (lang: string) => void;
  setWordTranslationId: (id: number) => void;
  setTafsirIds: (ids: number[]) => void;
  setTranslationIds: (ids: number[]) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

/**
 * Provides global access to user-configurable settings such as fonts, font sizes,
 * translation and tafsīr selections, word-by-word preferences and tajweed display.
 * Settings are persisted to `localStorage`.
 *
 * Wrap parts of the application that need these values with this provider and use
 * the {@link useSettings} hook to read or update them.
 */
export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, dispatch] = useReducer(reducer, defaultSettings, loadSettings);

  const settingsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestSettings = useRef(settings);

  useEffect(() => {
    dispatch({ type: 'SET_SETTINGS', value: loadSettings(defaultSettings) });
  }, []);

  // Save settings when changed (debounced)
  useEffect(() => {
    latestSettings.current = settings;
    if (typeof window === 'undefined') return;

    settingsTimeoutRef.current = setTimeout(() => {
      saveSettings(settings);
      settingsTimeoutRef.current = null;
    }, PERSIST_DEBOUNCE_MS);

    return () => {
      if (settingsTimeoutRef.current) clearTimeout(settingsTimeoutRef.current);
    };
  }, [settings]);

  // Flush any pending writes on unmount
  useEffect(() => {
    return () => {
      if (typeof window === 'undefined') return;
      if (settingsTimeoutRef.current) {
        clearTimeout(settingsTimeoutRef.current);
        saveSettings(latestSettings.current);
      }
    };
  }, []);

  const setSettings = useCallback(
    (s: Settings) => dispatch({ type: 'SET_SETTINGS', value: s }),
    []
  );
  const setShowByWords = useCallback(
    (val: boolean) => dispatch({ type: 'SET_SHOW_BY_WORDS', value: val }),
    []
  );
  const setTajweed = useCallback(
    (val: boolean) => dispatch({ type: 'SET_TAJWEED', value: val }),
    []
  );
  const setWordLang = useCallback(
    (lang: string) => dispatch({ type: 'SET_WORD_LANG', value: lang }),
    []
  );
  const setWordTranslationId = useCallback(
    (id: number) => dispatch({ type: 'SET_WORD_TRANSLATION_ID', value: id }),
    []
  );
  const setTafsirIds = useCallback(
    (ids: number[]) => dispatch({ type: 'SET_TAFSIR_IDS', value: ids }),
    []
  );
  const setTranslationIds = useCallback(
    (ids: number[]) => dispatch({ type: 'SET_TRANSLATION_IDS', value: ids }),
    []
  );

  const value = useMemo(
    () => ({
      settings,
      setSettings,
      arabicFonts: ARABIC_FONTS,
      setShowByWords,
      setTajweed,
      setWordLang,
      setWordTranslationId,
      setTafsirIds,
      setTranslationIds,
    }),
    [
      settings,
      setSettings,
      setShowByWords,
      setTajweed,
      setWordLang,
      setWordTranslationId,
      setTafsirIds,
      setTranslationIds,
    ]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
