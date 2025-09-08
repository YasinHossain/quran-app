import { useCallback } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';

import type { WordLanguage } from '@/app/(features)/surah/components/LanguageList';

export function useWordLanguageSelection() {
  const { settings, setSettings } = useSettings();

  const handleLanguageSelect = useCallback(
    (language: WordLanguage) => {
      setSettings((prev) => ({
        ...prev,
        wordLang: language.code,
        wordTranslationId: language.id,
      }));
    },
    [setSettings]
  );

  return { selectedId: settings.wordTranslationId, handleLanguageSelect } as const;
}
