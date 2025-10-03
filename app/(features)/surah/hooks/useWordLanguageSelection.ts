import { useCallback } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';

import type { WordLanguage } from '@/app/(features)/surah/components/LanguageList';

interface UseWordLanguageSelectionReturn {
  selectedId: number;
  handleLanguageSelect: (language: WordLanguage) => void;
}

export function useWordLanguageSelection(): UseWordLanguageSelectionReturn {
  const { settings, setWordLang, setWordTranslationId } = useSettings();

  const handleLanguageSelect = useCallback(
    (language: WordLanguage) => {
      setWordLang(language.code);
      setWordTranslationId(language.id);
    },
    [setWordLang, setWordTranslationId]
  );
  return { selectedId: settings.wordTranslationId, handleLanguageSelect } as const;
}
