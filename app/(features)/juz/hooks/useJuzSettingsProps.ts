import { useState } from 'react';

import { useSelectedNames } from '@/app/shared/hooks/useSelectedNames';

import type { useJuzData } from './useJuzData';

interface UseJuzSettingsPropsArgs {
  readonly t: (key: string) => string;
}

type UseJuzSettingsPropsInput = UseJuzSettingsPropsArgs &
  Pick<ReturnType<typeof useJuzData>, 'settings' | 'translationOptions' | 'wordLanguageOptions'>;

interface UseJuzSettingsPropsReturn {
  readonly isTranslationPanelOpen: boolean;
  readonly setIsTranslationPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly isWordPanelOpen: boolean;
  readonly setIsWordPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly selectedTranslationName: string;
  readonly selectedWordLanguageName: string;
}

export function useJuzSettingsProps(args: UseJuzSettingsPropsInput): UseJuzSettingsPropsReturn {
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
  };
}
