import type { MushafOption } from '@/types';

import { SettingsSidebarProps } from '@/app/shared/reader/settings/types';

export interface SettingsPanelsPropsConfig {
  isArabicFontPanelOpen: boolean;
  onArabicFontPanelClose: () => void;
  isTranslationPanelOpen: boolean;
  onTranslationPanelClose?: () => void;
  isTafsirPanelOpen: boolean;
  onTafsirPanelClose?: () => void;
  isWordLanguagePanelOpen: boolean;
  onWordLanguagePanelClose?: () => void;
  isMushafPanelOpen: boolean;
  onMushafPanelClose?: () => void;
  mushafOptions?: MushafOption[];
  selectedMushafId?: string;
  onMushafChange?: (id: string) => void;
}

export function buildPanelsProps(
  baseProps: Pick<
    SettingsSidebarProps,
    | 'isTranslationPanelOpen'
    | 'onTranslationPanelClose'
    | 'isTafsirPanelOpen'
    | 'onTafsirPanelClose'
    | 'isWordLanguagePanelOpen'
    | 'onWordLanguagePanelClose'
    | 'isMushafPanelOpen'
    | 'onMushafPanelClose'
    | 'mushafOptions'
    | 'selectedMushafId'
    | 'onMushafChange'
  >,
  localState: {
    isArabicFontPanelOpen: boolean;
    onArabicFontPanelClose: () => void;
  }
): SettingsPanelsPropsConfig {
  const coreProps = {
    ...localState,
    isTranslationPanelOpen: baseProps.isTranslationPanelOpen ?? false,
    isTafsirPanelOpen: baseProps.isTafsirPanelOpen ?? false,
    isWordLanguagePanelOpen: baseProps.isWordLanguagePanelOpen ?? false,
    isMushafPanelOpen: baseProps.isMushafPanelOpen ?? false,
  };

  // Add optional close handlers conditionally
  const conditionalProps: Partial<SettingsPanelsPropsConfig> = {};

  if (baseProps.onTranslationPanelClose !== undefined) {
    conditionalProps.onTranslationPanelClose = baseProps.onTranslationPanelClose;
  }

  if (baseProps.onTafsirPanelClose !== undefined) {
    conditionalProps.onTafsirPanelClose = baseProps.onTafsirPanelClose;
  }

  if (baseProps.onWordLanguagePanelClose !== undefined) {
    conditionalProps.onWordLanguagePanelClose = baseProps.onWordLanguagePanelClose;
  }
  if (baseProps.onMushafPanelClose !== undefined) {
    conditionalProps.onMushafPanelClose = baseProps.onMushafPanelClose;
  }
  if (baseProps.mushafOptions) {
    conditionalProps.mushafOptions = baseProps.mushafOptions;
  }
  if (baseProps.selectedMushafId) {
    conditionalProps.selectedMushafId = baseProps.selectedMushafId;
  }
  if (baseProps.onMushafChange) {
    conditionalProps.onMushafChange = baseProps.onMushafChange;
  }

  return { ...coreProps, ...conditionalProps };
}
