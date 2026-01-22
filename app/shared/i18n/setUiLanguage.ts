'use client';

import { i18n } from '@/app/i18n';

import { UI_LANGUAGE_STORAGE_KEY, type UiLanguageCode } from './uiLanguages';

export function setUiLanguage(language: UiLanguageCode): void {
  i18n.changeLanguage(language);

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(UI_LANGUAGE_STORAGE_KEY, language);
  }

  if (typeof document !== 'undefined') {
    document.documentElement.lang = language;
  }
}

