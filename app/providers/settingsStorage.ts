import { DEFAULT_MUSHAF_ID } from '@/data/mushaf/options';
import { getItem, setItem } from '@/lib/utils/safeLocalStorage';
import { Settings } from '@/types';

import { parseJson, normalizeSettings } from './settingsNormalization';

export const ARABIC_FONTS = [
  { name: 'KFGQ', value: '"UthmanicHafs1Ver18", serif', category: 'Uthmani' },
  { name: 'Me Quran', value: '"Me Quran", serif', category: 'Uthmani' },
  { name: 'Amiri Quran', value: '"Amiri Quran", serif', category: 'Uthmani' },

  { name: 'Scheherazade New', value: '"Scheherazade New", serif', category: 'Uthmani' },
  { name: 'Noto Naskh Arabic', value: '"Noto Naskh Arabic", serif', category: 'Uthmani' },

  { name: 'IndoPak Nastaleeq (Waqf Lazim)', value: '"IndoPak", serif', category: 'IndoPak' },
  { name: 'Noor-e-Huda', value: '"Noor-e-Huda", serif', category: 'IndoPak' },
  { name: 'Noor-e-Hidayat', value: '"Noor-e-Hidayat", serif', category: 'IndoPak' },
  { name: 'Noor-e-Hira', value: '"Noor-e-Hira", serif', category: 'IndoPak' },
  { name: 'Lateef', value: '"Lateef", serif', category: 'IndoPak' },
];

const DEFAULT_ARABIC_FONT_VALUE = '"UthmanicHafs1Ver18", serif';
const DEFAULT_ARABIC_FONT =
  ARABIC_FONTS.find((font) => font.value === DEFAULT_ARABIC_FONT_VALUE)?.value ??
  DEFAULT_ARABIC_FONT_VALUE;

export const defaultSettings: Settings = {
  translationId: 20,
  translationIds: [20],
  tafsirIds: [169],
  arabicFontSize: 34,
  translationFontSize: 18,
  tafsirFontSize: 18,
  arabicFontFace: DEFAULT_ARABIC_FONT,
  wordLang: 'en',
  wordTranslationId: 85,
  showByWords: false,
  tajweed: false,
  mushafId: DEFAULT_MUSHAF_ID,
};

const SETTINGS_KEY = 'quranAppSettings';
const SELECTED_TRANSLATIONS_KEY = 'selected-translations';

export const loadSettings = (defaults: Settings = defaultSettings): Settings => {
  if (typeof window === 'undefined') return defaults;

  const savedSettings = parseJson(getItem(SETTINGS_KEY));
  if (!savedSettings) return defaults;

  const savedTranslations = getItem(SELECTED_TRANSLATIONS_KEY);
  return normalizeSettings(savedSettings, savedTranslations, defaults);
};

export const saveSettings = (settings: Settings): void => {
  if (typeof window === 'undefined') return;
  setItem(SETTINGS_KEY, JSON.stringify(settings));
};
