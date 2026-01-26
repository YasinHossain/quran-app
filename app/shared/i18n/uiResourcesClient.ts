'use client';

import type { i18n as I18nInstance } from 'i18next';

import type { UiLanguageCode } from './uiLanguages';

type UiNamespace = 'translation' | 'player';
type JsonRecord = Record<string, unknown>;

type UiResources = {
  translation: JsonRecord;
  player: JsonRecord;
};

const CACHE = new Map<UiLanguageCode, UiResources>();

const fetchJson = async (url: string): Promise<JsonRecord> => {
  try {
    const response = await fetch(url, { cache: 'force-cache' });
    if (!response.ok) return {};
    return (await response.json()) as JsonRecord;
  } catch {
    return {};
  }
};

const loadUiResourcesClient = async (language: UiLanguageCode): Promise<UiResources> => {
  const cached = CACHE.get(language);
  if (cached) return cached;

  const [translation, player] = await Promise.all([
    fetchJson(`/locales/${language}/common.json`),
    fetchJson(`/locales/${language}/player.json`),
  ]);

  const resources: UiResources = { translation, player };
  CACHE.set(language, resources);
  return resources;
};

export const ensureUiResourcesLoaded = async (
  i18n: I18nInstance,
  language: UiLanguageCode
): Promise<void> => {
  const namespaces: UiNamespace[] = ['translation', 'player'];
  const hasAll = namespaces.every((ns) => i18n.hasResourceBundle(language, ns));
  if (hasAll) return;

  const resources = await loadUiResourcesClient(language);

  if (!i18n.hasResourceBundle(language, 'translation')) {
    i18n.addResourceBundle(language, 'translation', resources.translation, true, true);
  }

  if (!i18n.hasResourceBundle(language, 'player')) {
    i18n.addResourceBundle(language, 'player', resources.player, true, true);
  }
};
