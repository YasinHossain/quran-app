import { Settings } from '@/types';

type RawSettings = Partial<Settings> & { tafsirId?: number };

export const parseJson = <T>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const applyLegacyFields = (settings: RawSettings): void => {
  if (settings.tafsirId && !settings.tafsirIds) {
    settings.tafsirIds = [settings.tafsirId];
    delete settings.tafsirId;
  }
};

const readSavedTranslationIds = (savedTranslations: string | null): number[] | null => {
  if (!savedTranslations) {
    return null;
  }
  const parsed = parseJson<number[]>(savedTranslations);
  return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
};

const resolveTranslationIds = (
  settings: RawSettings,
  savedTranslations: string | null,
  defaults: Settings
): number[] => {
  if (settings.translationIds && settings.translationIds.length > 0) {
    return settings.translationIds;
  }

  const savedIds = readSavedTranslationIds(savedTranslations);
  if (savedIds) {
    if (settings.translationId === undefined && savedIds[0] !== undefined) {
      settings.translationId = savedIds[0];
    }
    return savedIds;
  }

  const fallbackPrimary = settings.translationId ?? defaults.translationId;
  return [fallbackPrimary];
};

const applySavedTranslations = (
  settings: RawSettings,
  savedTranslations: string | null,
  defaults: Settings
): void => {
  const translationIds = resolveTranslationIds(settings, savedTranslations, defaults);
  settings.translationIds = translationIds;

  if (settings.translationId === undefined) {
    settings.translationId = translationIds[0] ?? defaults.translationId;
  }
};

const ensureTafsirIds = (settings: RawSettings, defaults: Settings): void => {
  if (!settings.tafsirIds) {
    settings.tafsirIds = defaults.tafsirIds;
  }
};

export const normalizeSettings = (
  raw: RawSettings,
  savedTranslations: string | null,
  defaults: Settings
): Settings => {
  applyLegacyFields(raw);
  applySavedTranslations(raw, savedTranslations, defaults);
  ensureTafsirIds(raw, defaults);
  return { ...defaults, ...raw } as Settings;
};
