'use client';

import React, { createContext, useCallback, useContext, useMemo } from 'react';

import { Settings } from '@/types';

import { ARABIC_FONTS } from './settingsStorage';
import { usePersistentSettings } from './hooks/usePersistentSettings';

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
  const { settings, dispatch } = usePersistentSettings();

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
