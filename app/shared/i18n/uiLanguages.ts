import {
  DEFAULT_UI_LANGUAGE,
  ENABLED_LANGUAGES,
  getLanguageDefinition,
  type UiLanguageCode,
} from './languageRegistry';

export type { UiLanguageCode } from './languageRegistry';
export { DEFAULT_UI_LANGUAGE };

export const UI_LANGUAGE_STORAGE_KEY = 'ui-language';

/** Enabled UI languages, in picker order (derived from `languageRegistry`). */
export const UI_LANGUAGES: ReadonlyArray<{
  code: UiLanguageCode;
  label: string;
  nativeLabel: string;
}> = ENABLED_LANGUAGES.map((language) => ({
  code: language.code,
  label: language.englishName,
  nativeLabel: language.nativeName,
}));

export function isUiLanguageCode(value: string): value is UiLanguageCode {
  return UI_LANGUAGES.some((language) => language.code === value);
}

export function getUiLanguageDirection(language: UiLanguageCode): 'ltr' | 'rtl' {
  return getLanguageDefinition(language).dir;
}

export function getUiLanguageLabel(code: string): string {
  const found = UI_LANGUAGES.find((language) => language.code === code);
  return found?.nativeLabel ?? code;
}

/** Normalises a header, cookie or Accept-Language tag (`bn-BD` -> `bn`) to an enabled language. */
export function resolveUiLanguageTag(value: string | null | undefined): UiLanguageCode | null {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase()
    .split(/[-_]/)[0];
  return normalized && isUiLanguageCode(normalized) ? normalized : null;
}
