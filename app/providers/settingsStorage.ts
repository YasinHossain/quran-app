import { getItem, setItem } from '@/lib/utils/safeLocalStorage';
import { Settings } from '@/types';

import { parseJson, normalizeSettings } from './settingsNormalization';

export const ARABIC_FONTS = [
  { name: 'KFGQPC Uthman Taha', value: '"KFGQPC-Uthman-Taha", serif', category: 'Uthmani' },
  { name: 'Amiri', value: '"Amiri", serif', category: 'Uthmani' },
  { name: 'Scheherazade New', value: '"Scheherazade New", serif', category: 'Uthmani' },
  { name: 'Noto Naskh Arabic', value: '"Noto Naskh Arabic", serif', category: 'Uthmani' },
  { name: 'Noto Nastaliq Urdu', value: '"Noto Nastaliq Urdu", serif', category: 'IndoPak' },
  { name: 'Noor-e-Hira', value: '"Noor-e-Hira", serif', category: 'IndoPak' },
  { name: 'Lateef', value: '"Lateef", serif', category: 'IndoPak' },
];

const DEFAULT_ARABIC_FONT = ARABIC_FONTS[0]?.value ?? '"KFGQPC-Uthman-Taha", serif';

export const defaultSettings: Settings = {
  translationId: 20,
  translationIds: [20],
  tafsirIds: [169],
  arabicFontSize: 28,
  translationFontSize: 16,
  tafsirFontSize: 16,
  arabicFontFace: DEFAULT_ARABIC_FONT,
  wordLang: 'en',
  wordTranslationId: 85,
  showByWords: false,
  tajweed: false,
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
