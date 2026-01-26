import 'server-only';

import { readFile } from 'node:fs/promises';
import path from 'node:path';

import type { Resource } from 'i18next';

import { isUiLanguageCode, type UiLanguageCode } from './uiLanguages';

type UiNamespace = 'translation' | 'player';

const LOCALES_DIR = path.join(process.cwd(), 'public', 'locales');

const readJson = async <T>(filePath: string): Promise<T | null> => {
  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const loadNamespace = async (
  language: UiLanguageCode,
  filename: string
): Promise<Record<string, string>> => {
  const filePath = path.join(LOCALES_DIR, language, filename);
  const parsed = await readJson<Record<string, string>>(filePath);
  return parsed ?? {};
};

type UiResourceLanguage = Record<UiNamespace, Record<string, string>>;

const loadLanguageResources = async (language: UiLanguageCode): Promise<UiResourceLanguage> => {
  const [translation, player] = await Promise.all([
    loadNamespace(language, 'common.json'),
    loadNamespace(language, 'player.json'),
  ]);

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
