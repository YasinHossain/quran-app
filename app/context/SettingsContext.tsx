'use client';
import React, { createContext, useContext, useState, useEffect } from 'react'; // Import useEffect
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
  arabicFontSize: 28,
  translationFontSize: 16,
  arabicFontFace: ARABIC_FONTS[0].value,
  wordLang: 'en',
  showByWords: false,
  tajweed: false,
};

interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  arabicFonts: { name: string; value: string; category: string }[]; // Updated type to include category
  bookmarkedVerses: string[];
  toggleBookmark: (verseId: string) => void;
  setShowByWords: (val: boolean) => void;
  setTajweed: (val: boolean) => void;
  setWordLang: (lang: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize settings with default values
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const [bookmarkedVerses, setBookmarkedVerses] = useState<string[]>([]);

  // Effect to load settings from localStorage on the client side after initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('quranAppSettings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings({ ...defaultSettings, ...parsed });
        } catch (error) {
          console.error('Error parsing settings from localStorage:', error);
          // Optionally, clear localStorage if corrupted
          // localStorage.removeItem('quranAppSettings');
        }
      }
      const savedBookmarks = localStorage.getItem('quranAppBookmarks');
      if (savedBookmarks) {
        try {
          setBookmarkedVerses(JSON.parse(savedBookmarks));
        } catch (error) {
          console.error('Error parsing bookmarks from localStorage:', error);
          // Optionally, clear localStorage if corrupted
          // localStorage.removeItem('quranAppBookmarks');
        }
      }
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Effect to save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quranAppSettings', JSON.stringify(settings));
    }
  }, [settings]);

  // Effect to save bookmarks to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quranAppBookmarks', JSON.stringify(bookmarkedVerses));
    }
  }, [bookmarkedVerses]);

  const toggleBookmark = (verseId: string) => {
    setBookmarkedVerses(prevBookmarks =>
      prevBookmarks.includes(verseId)
        ? prevBookmarks.filter(id => id !== verseId)
        : [...prevBookmarks, verseId]
    );
  };

  const setShowByWords = (val: boolean) =>
    setSettings(prev => ({ ...prev, showByWords: val }));

  const setTajweed = (val: boolean) =>
    setSettings(prev => ({ ...prev, tajweed: val }));

  const setWordLang = (lang: string) =>
    setSettings(prev => ({ ...prev, wordLang: lang }));

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
        arabicFonts: ARABIC_FONTS,
        bookmarkedVerses,
        toggleBookmark,
        setShowByWords,
        setTajweed,
        setWordLang,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
          console.error('Error parsing settings from localStorage:', error);
          // Optionally, clear localStorage if corrupted
          // localStorage.removeItem('quranAppSettings');
        }
      }
      const savedBookmarks = localStorage.getItem('quranAppBookmarks');
      if (savedBookmarks) {
        try {
          setBookmarkedVerses(JSON.parse(savedBookmarks));
        } catch (error) {
          console.error('Error parsing bookmarks from localStorage:', error);
          // Optionally, clear localStorage if corrupted
          // localStorage.removeItem('quranAppBookmarks');
        }
      }
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Effect to save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quranAppSettings', JSON.stringify(settings));
    }
  }, [settings]);

  // Effect to save bookmarks to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quranAppBookmarks', JSON.stringify(bookmarkedVerses));
    }
  }, [bookmarkedVerses]);

  const toggleBookmark = (verseId: string) => {
    setBookmarkedVerses(prevBookmarks =>
      prevBookmarks.includes(verseId)
        ? prevBookmarks.filter(id => id !== verseId)
        : [...prevBookmarks, verseId]
    );
  };

  const setShowByWords = (val: boolean) =>
    setSettings(prev => ({ ...prev, showByWords: val }));

  const setTajweed = (val: boolean) =>
    setSettings(prev => ({ ...prev, tajweed: val }));

  const setWordLang = (lang: string) =>
    setSettings(prev => ({ ...prev, wordLang: lang }));

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
        arabicFonts: ARABIC_FONTS,
        bookmarkedVerses,
        toggleBookmark,
        setShowByWords,
        setTajweed,
        setWordLang,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};