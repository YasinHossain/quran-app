import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_CODES } from '@/lib/text/languageCodes';
import type { LanguageCode } from '@/lib/text/languageCodes';
import type { Settings } from '@/types';

interface Option {
  id: number;
  name: string;
}

export default function useSurahPanels({
  translationOptions,
  wordLanguageOptions,
  settings,
}: {
  translationOptions: Option[];
  wordLanguageOptions: Option[];
  settings: Settings | null;
}) {
  const { t } = useTranslation();
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);

  const selectedTranslationName = useMemo(() => {
    if (!settings) return t('select_translation');
    // Use the first translation from translationIds array, fallback to translationId
    const primaryId = settings.translationIds?.[0] || settings.translationId;
    return translationOptions.find((o) => o.id === primaryId)?.name || t('select_translation');
  }, [settings, translationOptions, t]);

  const selectedWordLanguageName = useMemo(() => {
    if (!settings) return t('select_word_translation');
    return (
      wordLanguageOptions.find(
        (o) =>
          (LANGUAGE_CODES as Record<string, LanguageCode>)[o.name.toLowerCase()] ===
          settings.wordLang
      )?.name || t('select_word_translation')
    );
  }, [settings, wordLanguageOptions, t]);

  return {
    isTranslationPanelOpen,
    openTranslationPanel: () => setIsTranslationPanelOpen(true),
    closeTranslationPanel: () => setIsTranslationPanelOpen(false),
    isWordLanguagePanelOpen: isWordPanelOpen,
    openWordLanguagePanel: () => setIsWordPanelOpen(true),
    closeWordLanguagePanel: () => setIsWordPanelOpen(false),
    selectedTranslationName,
    selectedWordLanguageName,
  } as const;
}
