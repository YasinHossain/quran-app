'use client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonBn from '@/public/locales/bn/common.json';
import playerBn from '@/public/locales/bn/player.json';
import commonEn from '@/public/locales/en/common.json';
import playerEn from '@/public/locales/en/player.json';

// Get saved language from localStorage (client-side only)
const getSavedLanguage = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('ui-language') || 'en';
  }
  return 'en';
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: commonEn, player: playerEn },
    bn: { translation: commonBn, player: playerBn },
  },
  ns: ['translation', 'player'],
  defaultNS: 'translation',
  lng: getSavedLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export { i18n };
