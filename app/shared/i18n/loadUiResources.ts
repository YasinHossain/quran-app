import 'server-only';

import type { Resource } from 'i18next';

import { isUiLanguageCode, type UiLanguageCode } from './uiLanguages';

type UiNamespace = 'translation' | 'player';

type UiJson = Record<string, unknown>;
type UiResourceLanguage = Record<UiNamespace, UiJson>;

type UiImporters = Record<UiLanguageCode, { common: () => Promise<UiJson>; player: () => Promise<UiJson> }>;

const IMPORTERS: UiImporters = {
  en: {
    common: async () => (await import('@/public/locales/en/common.json')).default as UiJson,
    player: async () => (await import('@/public/locales/en/player.json')).default as UiJson,
  },
  bn: {
    common: async () => (await import('@/public/locales/bn/common.json')).default as UiJson,
    player: async () => (await import('@/public/locales/bn/player.json')).default as UiJson,
  },
  ar: {
    common: async () => (await import('@/public/locales/ar/common.json')).default as UiJson,
    player: async () => (await import('@/public/locales/ar/player.json')).default as UiJson,
  },
  ur: {
    common: async () => (await import('@/public/locales/ur/common.json')).default as UiJson,
    player: async () => (await import('@/public/locales/ur/player.json')).default as UiJson,
  },
  hi: {
    common: async () => (await import('@/public/locales/hi/common.json')).default as UiJson,
    player: async () => (await import('@/public/locales/hi/player.json')).default as UiJson,
  },
};

const loadLanguageResources = async (language: UiLanguageCode): Promise<UiResourceLanguage> => {
  const importer = IMPORTERS[language];
  const [translation, player] = await Promise.all([importer.common(), importer.player()]);

  return { translation, player };
};

export const resolveUiLanguageFromHeader = (value: string | null | undefined): UiLanguageCode => {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase()
    .split(/[-_]/)[0];

  return normalized && isUiLanguageCode(normalized) ? normalized : 'en';
};

export const loadUiResources = async (language: UiLanguageCode): Promise<Resource> => {
  const resources: Resource = {};
  resources['en'] = await loadLanguageResources('en');
  if (language !== 'en') {
    resources[language] = await loadLanguageResources(language);
  }
  return resources;
};
