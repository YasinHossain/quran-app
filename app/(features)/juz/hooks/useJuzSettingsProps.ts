import { useState } from 'react';

import { useSelectedNames } from '@/app/shared/hooks/useSelectedNames';

import type { useJuzData } from './useJuzData';

export function useJuzSettingsProps(
  args: {
    t: (key: string) => string;
  } & Pick<ReturnType<typeof useJuzData>, 'settings' | 'translationOptions' | 'wordLanguageOptions'>
): {
  readonly isTranslationPanelOpen: boolean;
  readonly setIsTranslationPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly isWordPanelOpen: boolean;
  readonly setIsWordPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly selectedTranslationName: string;
  readonly selectedWordLanguageName: string;
} {
  const { settings, translationOptions, wordLanguageOptions, t } = args;

  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);

  const { selectedTranslationName, selectedWordLanguageName } = useSelectedNames({
    settings,
    translationOptions,
    wordLanguageOptions,
    t,
  });

  return {
    isTranslationPanelOpen,
    setIsTranslationPanelOpen,
    isWordPanelOpen,
    setIsWordPanelOpen,
    selectedTranslationName,
    selectedWordLanguageName,
  } as const;
}
