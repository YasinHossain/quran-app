import {
  DEFAULT_UI_LANGUAGE,
  ENABLED_LANGUAGES,
  getLanguageDefinition,
} from '@/app/shared/i18n/languageRegistry';
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

const toContentDefaults = (code: UiLanguageCode): ContentDefaults => {
  const { content } = getLanguageDefinition(code);
  return {
    translationIds: [...content.translationIds],
    tafsirIds: [...content.tafsirIds],
    wordLang: content.wordLang,
    wordTranslationId: content.wordTranslationId,
  };
};

/** Reader defaults per UI language, derived from `languageRegistry`. */
export const UI_LANGUAGE_CONTENT_DEFAULTS: Partial<Record<UiLanguageCode, ContentDefaults>> =
  Object.fromEntries(
    ENABLED_LANGUAGES.map((language) => [language.code, toContentDefaults(language.code)])
  );

export const getUiLanguageContentDefaults = (uiLanguage: UiLanguageCode): ContentDefaults =>
  UI_LANGUAGE_CONTENT_DEFAULTS[uiLanguage] ?? toContentDefaults(DEFAULT_UI_LANGUAGE);

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

  return DEFAULT_UI_LANGUAGE;
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
