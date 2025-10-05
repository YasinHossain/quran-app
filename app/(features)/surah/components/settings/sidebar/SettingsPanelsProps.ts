import { SettingsSidebarProps } from '@/app/(features)/surah/components/settings/types';

export interface SettingsPanelsPropsConfig {
  isArabicFontPanelOpen: boolean;
  onArabicFontPanelClose: () => void;
  isTranslationPanelOpen: boolean;
  onTranslationPanelClose?: () => void;
  isTafsirPanelOpen: boolean;
  onTafsirPanelClose?: () => void;
  isWordLanguagePanelOpen: boolean;
  onWordLanguagePanelClose?: () => void;
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

  return { ...coreProps, ...conditionalProps };
}
