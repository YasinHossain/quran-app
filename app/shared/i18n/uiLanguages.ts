export const UI_LANGUAGE_STORAGE_KEY = 'ui-language';

export const UI_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'bn', label: 'Bangla', nativeLabel: 'বাংলা' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
  { code: 'ur', label: 'Urdu', nativeLabel: 'اردو' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
] as const;

export type UiLanguageCode = (typeof UI_LANGUAGES)[number]['code'];

export function isUiLanguageCode(value: string): value is UiLanguageCode {
  return UI_LANGUAGES.some((language) => language.code === value);
}

const RTL_LANGUAGES: ReadonlySet<UiLanguageCode> = new Set(['ar', 'ur']);

export function getUiLanguageDirection(language: UiLanguageCode): 'ltr' | 'rtl' {
  return RTL_LANGUAGES.has(language) ? 'rtl' : 'ltr';
}

export function getUiLanguageLabel(code: string): string {
  const found = UI_LANGUAGES.find((language) => language.code === code);
  return found?.nativeLabel ?? code;
}
