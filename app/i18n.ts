'use client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonBn from '@/public/locales/bn/common.json';
import playerBn from '@/public/locales/bn/player.json';
import commonEn from '@/public/locales/en/common.json';
import playerEn from '@/public/locales/en/player.json';
import { formatNumber } from '@/lib/text/localizeNumbers';

// Get saved language from localStorage (client-side only)
const getSavedLanguage = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('ui-language') || 'en';
  }
  return 'en';
};

// Some Jest tests mock `react-i18next` without providing `initReactI18next`.
// Fall back to a no-op plugin so importing this module never crashes in tests.
const reactI18nextPlugin =
  initReactI18next ??
  ({
    type: '3rdParty',
    init: () => {},
  } as const);

i18n.use(reactI18nextPlugin).init({
  resources: {
    en: { translation: commonEn, player: playerEn },
    bn: { translation: commonBn, player: playerBn },
  },
  ns: ['translation', 'player'],
  defaultNS: 'translation',
  lng: getSavedLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
    format: (value, format, lng) => {
      if (typeof value !== 'number') return String(value);
      const languageCode = typeof lng === 'string' ? lng : 'en';
      if (format === 'number-group') {
        return formatNumber(value, languageCode, { useGrouping: true });
      }
      if (format === 'number') {
        return formatNumber(value, languageCode, { useGrouping: false });
      }
      return String(value);
    },
  },
});

export { i18n };
