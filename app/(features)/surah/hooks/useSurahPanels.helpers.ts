import { useCallback, useMemo } from 'react';

import { useUIState } from '@/app/providers/UIStateContext';
import { LANGUAGE_CODES } from '@/lib/text/languageCodes';

import type { PanelControls, SurahPanelOption } from './useSurahPanels.types';
import type { LanguageCode } from '@/lib/text/languageCodes';
import type { MushafOption, Settings } from '@/types';
import type { TFunction } from 'i18next';

export const usePanelControls = (): PanelControls => {
  const [isTranslationPanelOpen, openTranslationPanel, closeTranslationPanel] =
    usePanelVisibility('verse:translation-panel');
  const [isWordPanelOpen, openWordLanguagePanel, closeWordLanguagePanel] = usePanelVisibility(
    'verse:word-language-panel'
  );
  const [isMushafPanelOpen, openMushafPanel, closeMushafPanel] =
    usePanelVisibility('verse:mushaf-panel');

  return {
    isTranslationPanelOpen,
    openTranslationPanel,
    closeTranslationPanel,
    isWordLanguagePanelOpen: isWordPanelOpen,
    openWordLanguagePanel,
    closeWordLanguagePanel,
    isMushafPanelOpen,
    openMushafPanel,
    closeMushafPanel,
  } as const;
};

export const useSelectedNames = ({
  settings,
  translationOptions,
  wordLanguageOptions,
  mushafOptions,
  t,
}: {
  settings: Settings;
  translationOptions: SurahPanelOption[];
  wordLanguageOptions: SurahPanelOption[];
  mushafOptions: MushafOption[];
  t: TFunction<'translation'>;
}): {
  selectedTranslationName: string;
  selectedWordLanguageName: string;
  selectedMushafName: string;
} => {
  const selectedTranslationName = useMemo(
    () => getSelectedTranslationName(settings, translationOptions, t),
    [settings, translationOptions, t]
  );

  const selectedWordLanguageName = useMemo(
    () => getSelectedWordLanguageName(settings, wordLanguageOptions, t),
    [settings, wordLanguageOptions, t]
  );

  const selectedMushafName = useMemo(
    () => getSelectedMushafName(settings.mushafId, mushafOptions, t),
    [mushafOptions, settings.mushafId, t]
  );

  return { selectedTranslationName, selectedWordLanguageName, selectedMushafName };
};
export const useMushafChange = (
  settings: Settings,
  setSettings: (settings: Settings) => void
): ((id: string) => void) => {
  return useCallback(
    (id: string) => {
      if (settings.mushafId === id) return;

      // Sync tajweed setting with mushaf selection
      const isTajweedMushaf = id === 'qcf-tajweed-v4';

      setSettings({
        ...settings,
        mushafId: id,
        tajweed: isTajweedMushaf,
      });
    },
    [setSettings, settings]
  );
};

function getSelectedTranslationName(
  settings: Settings,
  translationOptions: SurahPanelOption[],
  t: TFunction<'translation'>
): string {
  if (settings.translationIds) {
    if (settings.translationIds.length === 0) return '';
    const primaryId = settings.translationIds[0];
    const primaryName =
      translationOptions.find((o) => o.id === primaryId)?.name || t('select_translation');

    const extraCount = settings.translationIds.length - 1;
    if (extraCount > 0) {
      return `${primaryName}, +${extraCount}`;
    }

    return primaryName;
  }

  const primaryId = settings.translationId;
  return translationOptions.find((o) => o.id === primaryId)?.name || t('select_translation');
}

function getSelectedWordLanguageName(
  settings: Settings,
  wordLanguageOptions: SurahPanelOption[],
  t: TFunction<'translation'>
): string {
  const match = wordLanguageOptions.find((option) => {
    const codeLookup = LANGUAGE_CODES as Record<string, LanguageCode>;
    return codeLookup[option.name.toLowerCase()] === settings.wordLang;
  });
  return match?.name || t('select_word_translation');
}

function getSelectedMushafName(
  mushafId: string | undefined,
  mushafOptions: MushafOption[],
  t: TFunction<'translation'>
): string {
  const mushaf = mushafOptions.find((option) => option.id === mushafId);
  return mushaf?.name ?? t('select_mushaf', { defaultValue: 'Select mushaf' });
}

function usePanelVisibility(panelId: string): [boolean, () => void, () => void] {
  const { isPanelOpen, openPanel, closePanel } = useUIState();
  const isOpen = isPanelOpen(panelId);
  const open = useCallback(() => openPanel(panelId), [openPanel, panelId]);
  const close = useCallback(() => closePanel(panelId), [closePanel, panelId]);
  return [isOpen, open, close];
}
