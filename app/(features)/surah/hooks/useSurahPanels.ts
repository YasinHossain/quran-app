import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LANGUAGE_CODES } from '@/lib/text/languageCodes';

import type { LanguageCode } from '@/lib/text/languageCodes';
import type { Settings } from '@/types';

interface Option {
  id: number;
  name: string;
}

export function useSurahPanels({
  translationOptions,
  wordLanguageOptions,
  settings,
}: {
  translationOptions: Option[];
  wordLanguageOptions: Option[];
  settings: Settings;
}): {
  isTranslationPanelOpen: boolean;
  openTranslationPanel: () => void;
  closeTranslationPanel: () => void;
  isWordLanguagePanelOpen: boolean;
  openWordLanguagePanel: () => void;
  closeWordLanguagePanel: () => void;
  selectedTranslationName: string;
  selectedWordLanguageName: string;
} {
  const { t } = useTranslation();
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);

  const openTranslationPanel = useCallback(
    () => setIsTranslationPanelOpen(true),
    [setIsTranslationPanelOpen]
  );

  const closeTranslationPanel = useCallback(
    () => setIsTranslationPanelOpen(false),
    [setIsTranslationPanelOpen]
  );

  const openWordLanguagePanel = useCallback(() => setIsWordPanelOpen(true), [setIsWordPanelOpen]);

  const closeWordLanguagePanel = useCallback(() => setIsWordPanelOpen(false), [setIsWordPanelOpen]);

  const selectedTranslationName = useMemo(
    () => getSelectedTranslationName(settings, translationOptions, t),
    [settings, settings.translationIds, settings.translationId, translationOptions, t]
  );

  const selectedWordLanguageName = useMemo(
    () => getSelectedWordLanguageName(settings, wordLanguageOptions, t),
    [settings, settings.wordLang, wordLanguageOptions, t]
  );

  return {
    isTranslationPanelOpen,
    openTranslationPanel,
    closeTranslationPanel,
    isWordLanguagePanelOpen: isWordPanelOpen,
    openWordLanguagePanel,
    closeWordLanguagePanel,
    selectedTranslationName,
    selectedWordLanguageName,
  } as const;
}

function getSelectedTranslationName(
  settings: Settings,
  translationOptions: Option[],
  t: (key: string) => string
): string {
  const primaryId = settings.translationIds?.[0] || settings.translationId;
  return translationOptions.find((o) => o.id === primaryId)?.name || t('select_translation');
}

function getSelectedWordLanguageName(
  settings: Settings,
  wordLanguageOptions: Option[],
  t: (key: string) => string
): string {
  const match = wordLanguageOptions.find(
    (o) =>
      (LANGUAGE_CODES as Record<string, LanguageCode>)[o.name.toLowerCase()] === settings.wordLang
  );
  return match?.name || t('select_word_translation');
}
