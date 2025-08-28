'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { Settings } from '@/types';
import { ARABIC_FONTS } from '@/src/domain/constants/fonts';
import { useSettingsService } from '@/src/application/hooks/useSettingsService';

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
  arabicFonts: typeof ARABIC_FONTS;
  setSettings: (settings: Record<string, unknown>) => Promise<void>;
  updateSettings: (updates: Record<string, unknown>) => Promise<void>;
  setShowByWords: (val: boolean) => Promise<void>;
  setTajweed: (val: boolean) => Promise<void>;
  setWordLang: (lang: string) => Promise<void>;
  setWordTranslationId: (id: number) => Promise<void>;
  setTafsirIds: (ids: number[]) => Promise<void>;
  setTranslationIds: (ids: number[]) => Promise<void>;
  setFontSize: (size: number) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

/**
 * Provides global access to user-configurable settings such as fonts, font sizes,
 * translation and tafsīr selections, word-by-word preferences and tajweed display.
 * Settings are persisted using clean architecture services.
 *
 * Wrap parts of the application that need these values with this provider and use
 * the {@link useSettings} hook to read or update them.
 */
export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const settingsService = useSettingsService();

  const value = useMemo(
    () => ({
      settings: settingsService.settings,
      loading: settingsService.loading,
      error: settingsService.error,
      arabicFonts: ARABIC_FONTS,
      setSettings: settingsService.updateSettings,
      updateSettings: settingsService.updateSettings,
      setShowByWords: settingsService.setShowByWords,
      setTajweed: settingsService.setTajweed,
      setWordLang: settingsService.setWordLang,
      setWordTranslationId: settingsService.setWordTranslationId,
      setTafsirIds: settingsService.setTafsirIds,
      setTranslationIds: settingsService.setTranslationIds,
      setFontSize: settingsService.setFontSize,
    }),
    [settingsService]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
