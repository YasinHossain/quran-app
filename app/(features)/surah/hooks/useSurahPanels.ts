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
}) {
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

  const selectedTranslationName = useMemo(() => {
    // Use the first translation from translationIds array, fallback to translationId
    const primaryId = settings.translationIds?.[0] || settings.translationId;
    return translationOptions.find((o) => o.id === primaryId)?.name || t('select_translation');
  }, [settings.translationIds, settings.translationId, translationOptions, t]);

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
    openTranslationPanel,
    closeTranslationPanel,
    isWordLanguagePanelOpen: isWordPanelOpen,
    openWordLanguagePanel,
    closeWordLanguagePanel,
    selectedTranslationName,
    selectedWordLanguageName,
  } as const;
}
