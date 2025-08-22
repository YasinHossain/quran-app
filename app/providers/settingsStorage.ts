import { Settings } from '@/types';
import { RECITERS } from '@/lib/audio/reciters';

export const ARABIC_FONTS = [
  { name: 'KFGQPC Uthman Taha', value: '"KFGQPC-Uthman-Taha", serif', category: 'Uthmani' },
  { name: 'Amiri', value: '"Amiri", serif', category: 'Uthmani' },
  { name: 'Scheherazade New', value: '"Scheherazade New", serif', category: 'Uthmani' },
  { name: 'Noto Naskh Arabic', value: '"Noto Naskh Arabic", serif', category: 'Uthmani' },
  { name: 'Noto Nastaliq Urdu', value: '"Noto Nastaliq Urdu", serif', category: 'IndoPak' },
  { name: 'Noor-e-Hira', value: '"Noor-e-Hira", serif', category: 'IndoPak' },
  { name: 'Lateef', value: '"Lateef", serif', category: 'IndoPak' },
];

export const defaultSettings: Settings = {
  translationId: 20,
  translationIds: [20],
  tafsirIds: [169],
  arabicFontSize: 28,
  translationFontSize: 16,
  tafsirFontSize: 16,
  arabicFontFace: ARABIC_FONTS[0].value,
  wordLang: 'en',
  wordTranslationId: 85,
  showByWords: false,
  tajweed: false,
  reciterId: RECITERS[0].id,
};

const SETTINGS_KEY = 'quranAppSettings';
const SELECTED_TRANSLATIONS_KEY = 'selected-translations';

export const loadSettings = (defaults: Settings = defaultSettings): Settings => {
  if (typeof window === 'undefined') return defaults;

  const savedSettings = localStorage.getItem(SETTINGS_KEY);
  const savedTranslations = localStorage.getItem(SELECTED_TRANSLATIONS_KEY);
  if (!savedSettings) return defaults;

  try {
    const parsed = JSON.parse(savedSettings);

    if (parsed.tafsirId && !parsed.tafsirIds) {
      parsed.tafsirIds = [parsed.tafsirId];
      delete parsed.tafsirId;
    }

    if (!parsed.translationIds && savedTranslations) {
      try {
        const translationIds = JSON.parse(savedTranslations);
        if (Array.isArray(translationIds) && translationIds.length > 0) {
          parsed.translationIds = translationIds;
          parsed.translationId = translationIds[0];
        }
      } catch (e) {
        console.warn('Failed to parse selected-translations:', e);
      }
    }

    if (!parsed.translationIds) {
      parsed.translationIds = parsed.translationId
        ? [parsed.translationId]
        : [defaults.translationId];
    }

    if (!parsed.tafsirIds) {
      parsed.tafsirIds = defaults.tafsirIds;
    }

    return { ...defaults, ...parsed } as Settings;
  } catch (error) {
    console.error('Error parsing settings from localStorage:', error);
    return defaults;
  }
};

export const saveSettings = (settings: Settings) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};
