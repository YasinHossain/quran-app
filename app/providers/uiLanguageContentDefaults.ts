import {
  UI_LANGUAGE_STORAGE_KEY,
  isUiLanguageCode,
  type UiLanguageCode,
} from '@/app/shared/i18n/uiLanguages';
import { getItem } from '@/lib/utils/safeLocalStorage';

import type { Settings } from '@/types';

type ContentDefaults = Pick<
  Settings,
  'translationIds' | 'tafsirIds' | 'wordLang' | 'wordTranslationId'
>;

const EN_CONTENT_DEFAULTS: ContentDefaults = {
  translationIds: [20], // Saheeh International
  tafsirIds: [169], // English tafsir default
  wordLang: 'en',
  wordTranslationId: 85, // M.A.S. Abdel Haleem (used by the current WBW selector)
};

export const UI_LANGUAGE_CONTENT_DEFAULTS: Partial<Record<UiLanguageCode, ContentDefaults>> = {
  en: EN_CONTENT_DEFAULTS,
  bn: {
    translationIds: [161], // Taisirul Quran
    tafsirIds: [164], // Tafseer ibn Kathir (Bangla)
    wordLang: 'bn',
    wordTranslationId: 161, // Bengali entry from QDC resources list
  },
  hi: {
    translationIds: [122], // Maulana Azizul Haque al-Umari
    tafsirIds: [169], // QDC does not provide a Hindi tafsir resource; fall back to English.
    wordLang: 'hi',
    wordTranslationId: 122, // Hindi entry from QDC resources list
  },
  ur: {
    translationIds: [54], // Maulana Muhammad Junagarhi
    tafsirIds: [160], // Tafsir Ibn Kathir (Urdu)
    wordLang: 'ur',
    wordTranslationId: 54, // Urdu entry from QDC resources list
  },
  ar: {
    translationIds: [], // No translation by default for Arabic UI
    tafsirIds: [14], // Tafsir Ibn Kathir (Arabic)
    // Word-by-word is not required for Arabic UI; keep English hover defaults.
    wordLang: 'en',
    wordTranslationId: 85,
  },
} as const;

export const getUiLanguageContentDefaults = (uiLanguage: UiLanguageCode): ContentDefaults =>
  UI_LANGUAGE_CONTENT_DEFAULTS[uiLanguage] ?? EN_CONTENT_DEFAULTS;

const normalizeLanguageTag = (value: string | null | undefined): string | undefined => {
  const trimmed = String(value ?? '')
    .trim()
    .toLowerCase();
  if (!trimmed) return undefined;
  return trimmed.split('-')[0] ?? undefined;
};

export const resolveUiLanguageCode = (value?: string | null | undefined): UiLanguageCode => {
  const fromValue = normalizeLanguageTag(value);
  if (fromValue && isUiLanguageCode(fromValue)) {
    return fromValue;
  }

  const stored = normalizeLanguageTag(getItem(UI_LANGUAGE_STORAGE_KEY));
  if (stored && isUiLanguageCode(stored)) {
    return stored;
  }

  return 'en';
};

export const withUiLanguageContentDefaults = (
  defaults: Settings,
  uiLanguage: UiLanguageCode
): Settings => {
  const contentDefaults = getUiLanguageContentDefaults(uiLanguage);
  const primaryTranslationId = contentDefaults.translationIds[0] ?? defaults.translationId;

  return {
    ...defaults,
    ...contentDefaults,
    translationId: primaryTranslationId,
    contentLanguage: uiLanguage,
  };
};

export const applyUiLanguageContentDefaults = (
  settings: Settings,
  uiLanguage: UiLanguageCode
): Settings => {
  const contentDefaults = getUiLanguageContentDefaults(uiLanguage);
  const primaryTranslationId = contentDefaults.translationIds[0] ?? settings.translationId;

  return {
    ...settings,
    ...contentDefaults,
    translationId: primaryTranslationId,
    contentLanguage: uiLanguage,
  };
};
