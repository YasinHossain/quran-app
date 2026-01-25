'use client';

import { UI_LANGUAGE_STORAGE_KEY, type UiLanguageCode } from './uiLanguages';

import type { i18n as I18nInstance } from 'i18next';

const LOCALE_PREFIX_RE = /^\/(en|bn)(?=\/|$)/;

export function localizePathname(pathname: string, language: UiLanguageCode): string {
  const current = pathname?.startsWith('/') ? pathname : '/';

  if (LOCALE_PREFIX_RE.test(current)) {
    return current.replace(LOCALE_PREFIX_RE, `/${language}`);
  }

  return current === '/' ? `/${language}` : `/${language}${current}`;
}

export function setUiLanguage(i18n: I18nInstance, language: UiLanguageCode): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(UI_LANGUAGE_STORAGE_KEY, language);
  }

  if (typeof document !== 'undefined') {
    document.documentElement.lang = language;
    const secure = typeof window !== 'undefined' && window.location?.protocol === 'https:';
    document.cookie = `${UI_LANGUAGE_STORAGE_KEY}=${encodeURIComponent(language)}; path=/; max-age=31536000; SameSite=Lax${
      secure ? '; Secure' : ''
    }`;
  }

  i18n.changeLanguage(language).catch(() => {});
}
