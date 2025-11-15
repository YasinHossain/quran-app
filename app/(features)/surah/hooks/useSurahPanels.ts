import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LANGUAGE_CODES } from '@/lib/text/languageCodes';

import type { LanguageCode } from '@/lib/text/languageCodes';
import type { MushafOption, Settings } from '@/types';

interface Option {
  id: number;
  name: string;
}

export function useSurahPanels({
  translationOptions,
  wordLanguageOptions,
  settings,
  setSettings,
  mushafOptions,
}: {
  translationOptions: Option[];
  wordLanguageOptions: Option[];
  settings: Settings;
  setSettings: (settings: Settings) => void;
  mushafOptions: MushafOption[];
}): {
  isTranslationPanelOpen: boolean;
  openTranslationPanel: () => void;
  closeTranslationPanel: () => void;
  isWordLanguagePanelOpen: boolean;
  openWordLanguagePanel: () => void;
  closeWordLanguagePanel: () => void;
  selectedTranslationName: string;
  selectedWordLanguageName: string;
  selectedMushafName: string;
  selectedMushafId?: string;
  isMushafPanelOpen: boolean;
  openMushafPanel: () => void;
  closeMushafPanel: () => void;
  mushafOptions: MushafOption[];
  onMushafChange: (id: string) => void;
} {
  const { t } = useTranslation();
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);
  const [isMushafPanelOpen, setIsMushafPanelOpen] = useState(false);

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

  const openMushafPanel = useCallback(() => setIsMushafPanelOpen(true), []);
  const closeMushafPanel = useCallback(() => setIsMushafPanelOpen(false), []);

  const selectedTranslationName = useMemo(
    () => getSelectedTranslationName(settings, translationOptions, t),
    [settings, translationOptions, t]
  );

  const selectedWordLanguageName = useMemo(
    () => getSelectedWordLanguageName(settings, wordLanguageOptions, t),
    [settings, wordLanguageOptions, t]
  );

  const selectedMushafName = useMemo(() => {
    const mushaf = mushafOptions.find((option) => option.id === settings.mushafId);
    return mushaf?.name ?? t('select_mushaf', { defaultValue: 'Select mushaf' });
  }, [mushafOptions, settings.mushafId, t]);

  const handleMushafChange = useCallback(
    (id: string) => {
      if (settings.mushafId === id) return;
      setSettings({ ...settings, mushafId: id });
    },
    [setSettings, settings]
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
    selectedMushafName,
    selectedMushafId: settings.mushafId,
    isMushafPanelOpen,
    openMushafPanel,
    closeMushafPanel,
    mushafOptions,
    onMushafChange: handleMushafChange,
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
