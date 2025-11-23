import { useTranslation } from 'react-i18next';

import { useMushafChange, usePanelControls, useSelectedNames } from './useSurahPanels.helpers';

import type { SurahPanelOption } from './useSurahPanels.types';
import type { MushafOption, Settings } from '@/types';

export function useSurahPanels({
  translationOptions,
  wordLanguageOptions,
  settings,
  setSettings,
  mushafOptions,
}: {
  translationOptions: SurahPanelOption[];
  wordLanguageOptions: SurahPanelOption[];
  settings: Settings;
  setSettings: (settings: Settings) => void;
  mushafOptions: MushafOption[];
}): UseSurahPanelsResult {
  const { t } = useTranslation();
  const panelControls = usePanelControls();
  const selectedNames = useSelectedNames({
    settings,
    translationOptions,
    wordLanguageOptions,
    mushafOptions,
    t,
  });
  const onMushafChange = useMushafChange(settings, setSettings);

  return {
    ...panelControls,
    ...selectedNames,
    selectedMushafId: settings.mushafId,
    mushafOptions,
    onMushafChange,
  } as const;
}

interface UseSurahPanelsResult {
  isTranslationPanelOpen: boolean;
  openTranslationPanel: () => void;
  closeTranslationPanel: () => void;
  isWordLanguagePanelOpen: boolean;
  openWordLanguagePanel: () => void;
  closeWordLanguagePanel: () => void;
  selectedTranslationName: string;
  selectedWordLanguageName: string;
  selectedMushafName: string;
  selectedMushafId?: string | undefined;
  isMushafPanelOpen: boolean;
  openMushafPanel: () => void;
  closeMushafPanel: () => void;
  mushafOptions: MushafOption[];
  onMushafChange: (id: string) => void;
}
