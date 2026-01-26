'use client';

import {
  getUiLanguageDirection,
  UI_LANGUAGE_STORAGE_KEY,
  type UiLanguageCode,
} from './uiLanguages';
import { ensureUiResourcesLoaded } from './uiResourcesClient';

import type { i18n as I18nInstance } from 'i18next';

export function setUiLanguage(
  i18n: I18nInstance,
  language: UiLanguageCode,
  options?: { changeI18n?: boolean }
): void {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(UI_LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Ignore storage access failures (blocked/denied in some environments).
    }
  }

  if (typeof document !== 'undefined') {
    try {
      document.documentElement.lang = language;
      document.documentElement.dir = getUiLanguageDirection(language);
      const secure = typeof window !== 'undefined' && window.location?.protocol === 'https:';
      document.cookie = `${UI_LANGUAGE_STORAGE_KEY}=${encodeURIComponent(language)}; path=/; max-age=31536000; SameSite=Lax${
        secure ? '; Secure' : ''
      }`;
    } catch {
      // Ignore cookie/DOM access failures.
    }
  }

  if (options?.changeI18n === false) return;
  if (i18n.language === language) return;

  void ensureUiResourcesLoaded(i18n, language)
    .then(() => i18n.changeLanguage(language))
    .catch(() => {});
}
