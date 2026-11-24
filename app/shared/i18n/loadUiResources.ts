import 'server-only';

import { DEFAULT_UI_LANGUAGE, type UiLanguageCode } from './uiLanguages';

import type { Resource } from 'i18next';

type UiNamespace = 'translation' | 'player';

type UiJson = Record<string, unknown>;
type UiResourceLanguage = Record<UiNamespace, UiJson>;

// Webpack/Turbopack bundle every `public/locales/<code>/*.json` behind these template imports, so
// a new language only needs its JSON files and a registry entry.
const importLocaleJson = async (
  language: UiLanguageCode,
  file: 'common' | 'player'
): Promise<UiJson> => (await import(`@/public/locales/${language}/${file}.json`)).default as UiJson;

const COMMON_CACHE = new Map<UiLanguageCode, Promise<UiJson>>();

export const loadUiCommonJson = async (language: UiLanguageCode): Promise<UiJson> => {
  const cached = COMMON_CACHE.get(language);
  if (cached) return cached;

  const promise = importLocaleJson(language, 'common').catch((error) => {
    COMMON_CACHE.delete(language);
    throw error;
  });
  COMMON_CACHE.set(language, promise);
  return promise;
};

const loadLanguageResources = async (language: UiLanguageCode): Promise<UiResourceLanguage> => {
  const [translation, player] = await Promise.all([
    loadUiCommonJson(language),
    importLocaleJson(language, 'player'),
  ]);

  return { translation, player };
};

export const loadUiResources = async (language: UiLanguageCode): Promise<Resource> => {
  const resources: Resource = {};
  resources[DEFAULT_UI_LANGUAGE] = await loadLanguageResources(DEFAULT_UI_LANGUAGE);
  if (language !== DEFAULT_UI_LANGUAGE) {
    resources[language] = await loadLanguageResources(language);
  }
  return resources;
};
