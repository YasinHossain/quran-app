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

export const UI_LANGUAGE_CONTENT_DEFAULTS: Record<UiLanguageCode, ContentDefaults> = {
  en: {
    translationIds: [20], // Saheeh International
    tafsirIds: [169], // English tafsir default
    wordLang: 'en',
    wordTranslationId: 85, // M.A.S. Abdel Haleem (used by the current WBW selector)
  },
  bn: {
    translationIds: [161], // Taisirul Quran
    tafsirIds: [164], // Tafseer ibn Kathir (Bangla)
    wordLang: 'bn',
    wordTranslationId: 161, // Bengali entry from QDC resources list
  },
} as const;

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
  const contentDefaults =
    UI_LANGUAGE_CONTENT_DEFAULTS[uiLanguage] ?? UI_LANGUAGE_CONTENT_DEFAULTS.en;
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
  const contentDefaults =
    UI_LANGUAGE_CONTENT_DEFAULTS[uiLanguage] ?? UI_LANGUAGE_CONTENT_DEFAULTS.en;
  const primaryTranslationId = contentDefaults.translationIds[0] ?? settings.translationId;

  return {
    ...settings,
    ...contentDefaults,
    translationId: primaryTranslationId,
    contentLanguage: uiLanguage,
  };
};
