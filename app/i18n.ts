'use client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import commonEn from '../public/locales/en/common.json';
import playerEn from '../public/locales/en/player.json';
import commonBn from '../public/locales/bn/common.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: commonEn, player: playerEn },
    bn: { translation: commonBn },
  },
  ns: ['translation', 'player'],
  defaultNS: 'translation',
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
