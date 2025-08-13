'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { Settings } from '@/types';

export const ARABIC_FONTS = [
  { name: 'KFGQPC Uthman Taha', value: '"KFGQPC-Uthman-Taha", serif', category: 'Uthmani' },
  { name: 'Al Mushaf', value: '"Al-Mushaf", serif', category: 'Uthmani' },
  { name: 'Amiri', value: '"Amiri", serif', category: 'Uthmani' },
  { name: 'Scheherazade New', value: '"Scheherazade New", serif', category: 'Uthmani' },
  { name: 'Noto Naskh Arabic', value: '"Noto Naskh Arabic", serif', category: 'Uthmani' },
  { name: 'Me Quran', value: '"Me-Quran", serif', category: 'Uthmani' },
  { name: 'PDMS Saleem Quran', value: '"PDMS-Saleem-Quran", serif', category: 'Uthmani' },
  { name: 'Noto Nastaliq Urdu', value: '"Noto Nastaliq Urdu", serif', category: 'IndoPak' },
  { name: 'Noor-e-Hira', value: '"Noor-e-Hira", serif', category: 'IndoPak' },
  { name: 'Lateef', value: '"Lateef", serif', category: 'IndoPak' },
];

// Define default settings
const defaultSettings: Settings = {
  translationId: 20,
  tafsirIds: [169],
  arabicFontSize: 28,
  translationFontSize: 16,
  tafsirFontSize: 16,
  arabicFontFace: ARABIC_FONTS[0].value,
  wordLang: 'en',
  wordTranslationId: 85,
  showByWords: false,
  tajweed: false,
};

// Debounce interval for persisting to localStorage.
// Shorter intervals save sooner but risk more writes; longer ones delay persistence.
const PERSIST_DEBOUNCE_MS = 300;

interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  arabicFonts: { name: string; value: string; category: string }[];
  setShowByWords: (val: boolean) => void;
  setTajweed: (val: boolean) => void;
  setWordLang: (lang: string) => void;
  setWordTranslationId: (id: number) => void;
  setTafsirIds: (ids: number[]) => void;
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
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const settingsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestSettings = useRef(settings);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('quranAppSettings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          if (parsed.tafsirId && !parsed.tafsirIds) {
            parsed.tafsirIds = [parsed.tafsirId];
            delete parsed.tafsirId;
          }
          setSettings({ ...defaultSettings, ...parsed });
        } catch (error) {
          console.error('Error parsing settings from localStorage:', error);
        }
      }
    }
  }, []);

  // Save settings when changed (debounced)
  useEffect(() => {
    latestSettings.current = settings;
    if (typeof window === 'undefined') return;

    settingsTimeoutRef.current = setTimeout(() => {
      localStorage.setItem('quranAppSettings', JSON.stringify(settings));
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
        localStorage.setItem('quranAppSettings', JSON.stringify(latestSettings.current));
      }
    };
  }, []);

  const setShowByWords = useCallback(
    (val: boolean) => setSettings((prev) => ({ ...prev, showByWords: val })),
    [setSettings]
  );

  const setTajweed = useCallback(
    (val: boolean) => setSettings((prev) => ({ ...prev, tajweed: val })),
    [setSettings]
  );

  const setWordLang = useCallback(
    (lang: string) => setSettings((prev) => ({ ...prev, wordLang: lang })),
    [setSettings]
  );

  const setWordTranslationId = useCallback(
    (id: number) => setSettings((prev) => ({ ...prev, wordTranslationId: id })),
    [setSettings]
  );

  const setTafsirIds = useCallback(
    (ids: number[]) => setSettings((prev) => ({ ...prev, tafsirIds: ids })),
    [setSettings]
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
    }),
    [
      settings,
      setSettings,
      setShowByWords,
      setTajweed,
      setWordLang,
      setWordTranslationId,
      setTafsirIds,
    ]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
