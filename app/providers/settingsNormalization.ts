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

const applySavedTranslations = (
  settings: RawSettings,
  savedTranslations: string | null,
  defaults: Settings
): void => {
  if (!settings.translationIds && savedTranslations) {
    const ids = parseJson<number[]>(savedTranslations);
    if (Array.isArray(ids) && ids.length > 0) {
      settings.translationIds = ids;
      settings.translationId = ids[0];
    }
  }

  if (!settings.translationIds) {
    settings.translationIds = settings.translationId
      ? [settings.translationId]
      : [defaults.translationId];
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
