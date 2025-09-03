import { useMemo, useState } from 'react';
import { useSettings } from '@/app/providers/SettingsContext';
import { useTranslation } from 'react-i18next';
import useTranslationOptions from '@/app/(features)/surah/hooks/useTranslationOptions';
import { LANGUAGE_CODES } from '@/lib/text/languageCodes';
import type { LanguageCode } from '@/lib/text/languageCodes';

/**
 * Hook for managing bookmark folder panel states and translation options.
 * Handles translation and word language panel state management.
 */
export function useBookmarkFolderPanels(): {
  isTranslationPanelOpen: boolean;
  setIsTranslationPanelOpen: (open: boolean) => void;
  isWordPanelOpen: boolean;
  setIsWordPanelOpen: (open: boolean) => void;
  selectedTranslationName: string;
  selectedWordLanguageName: string;
} {
  const { settings } = useSettings();
  const { t } = useTranslation();
  const { translationOptions, wordLanguageOptions } = useTranslationOptions();

  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);

  const selectedTranslationName = useMemo(
    () =>
      translationOptions.find((o) => o.id === settings.translationId)?.name ||
      t('select_translation'),
    [settings.translationId, translationOptions, t]
  );

  const selectedWordLanguageName = useMemo(
    () =>
      wordLanguageOptions.find(
        (o) =>
          (LANGUAGE_CODES as Record<string, LanguageCode>)[o.name.toLowerCase()] ===
          settings.wordLang
      )?.name || t('select_word_translation'),
    [settings.wordLang, wordLanguageOptions, t]
  );

  return {
    isTranslationPanelOpen,
    setIsTranslationPanelOpen,
    isWordPanelOpen,
    setIsWordPanelOpen,
    selectedTranslationName,
    selectedWordLanguageName,
  } as const;
}

export default useBookmarkFolderPanels;
