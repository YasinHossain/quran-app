export const UI_LANGUAGE_STORAGE_KEY = 'ui-language';

export const UI_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'bn', label: 'Bangla', nativeLabel: 'বাংলা' },
] as const;

export type UiLanguageCode = (typeof UI_LANGUAGES)[number]['code'];

export function isUiLanguageCode(value: string): value is UiLanguageCode {
  return UI_LANGUAGES.some((language) => language.code === value);
}

export function getUiLanguageLabel(code: string): string {
  const found = UI_LANGUAGES.find((language) => language.code === code);
  return found?.nativeLabel ?? code;
}
