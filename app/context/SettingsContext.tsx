'use client';
import React, { createContext, useContext, useState } from 'react';
import { Settings } from '@/types';

export const ARABIC_FONTS = [
  { name: 'KFGQ', value: '"KFGQPC Uthman Taha Naskh", serif' },
  { name: 'Me Quran', value: '"Me Quran", sans-serif' },
  { name: 'Al Mushaf', value: '"Al Mushaf", serif' },
];

interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  arabicFonts: { name: string; value: string }[];
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Settings>({
    translationId: 20,
    arabicFontSize: 28,
    translationFontSize: 16,
    arabicFontFace: ARABIC_FONTS[0].value,
  });

  return (
    <SettingsContext.Provider value={{ settings, setSettings, arabicFonts: ARABIC_FONTS }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
