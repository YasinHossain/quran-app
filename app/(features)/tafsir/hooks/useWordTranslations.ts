import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/app/providers/SettingsContext';
import { getWordTranslations } from '@/lib/api';
import { WORD_LANGUAGE_LABELS } from '@/lib/text/wordLanguages';
import { LANGUAGE_CODES } from '@/lib/text/languageCodes';
import type { LanguageCode } from '@/lib/text/languageCodes';

const DEFAULT_WORD_TRANSLATION_ID = 85;

export const useWordTranslations = () => {
  const { t } = useTranslation();
  const { settings, setSettings } = useSettings();

  const { data } = useSWR('wordTranslations', getWordTranslations);

  const wordLanguageMap = useMemo(() => {
    const map: Record<string, number> = {};
    (data || []).forEach((o) => {
      const name = o.lang.toLowerCase();
      if (!map[name]) {
        map[name] = o.id;
      }
    });
    return map;
  }, [data]);

  const wordLanguageOptions = useMemo(
    () =>
      Object.keys(wordLanguageMap)
        .filter((name) => WORD_LANGUAGE_LABELS[name])
        .map((name) => ({ name: WORD_LANGUAGE_LABELS[name], id: wordLanguageMap[name] })),
    [wordLanguageMap]
  );

  const selectedWordLanguageName = useMemo(
    () =>
      wordLanguageOptions.find(
        (o) =>
          (LANGUAGE_CODES as Record<string, LanguageCode>)[o.name.toLowerCase()] ===
          settings?.wordLang
      )?.name || t('select_word_translation'),
    [wordLanguageOptions, settings?.wordLang, t]
  );

  const resetWordSettings = useCallback(() => {
    if (!settings) return;
    setSettings({
      ...settings,
      wordLang: 'en',
      wordTranslationId: wordLanguageMap['english'] ?? DEFAULT_WORD_TRANSLATION_ID,
    });
  }, [settings, setSettings, wordLanguageMap]);

  return {
    wordLanguageOptions,
    wordLanguageMap,
    selectedWordLanguageName,
    resetWordSettings,
  };
};
