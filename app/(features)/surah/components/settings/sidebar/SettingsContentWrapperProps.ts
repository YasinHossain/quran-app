import { SettingsSidebarProps } from '../types';

export interface SettingsContentWrapperPropsConfig {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabOptions: Array<{ id: string; label: string }>;
  openSections: Record<string, boolean>;
  onSectionToggle: (section: string) => void;
  onArabicFontPanelOpen: () => void;
  onTranslationPanelOpen?: () => void;
  onWordLanguagePanelOpen?: () => void;
  onTafsirPanelOpen?: () => void;
  selectedTranslationName?: string;
  selectedTafsirName?: string;
  selectedWordLanguageName?: string;
  showTafsirSetting: boolean;
}

export function buildContentWrapperProps(
  baseProps: Pick<
    SettingsSidebarProps,
    | 'onTranslationPanelOpen'
    | 'onTafsirPanelOpen'
    | 'onWordLanguagePanelOpen'
    | 'selectedTranslationName'
    | 'selectedTafsirName'
    | 'selectedWordLanguageName'
    | 'showTafsirSetting'
  >,
  stateProps: {
    activeTab: string;
    onTabChange: (tab: string) => void;
    tabOptions: Array<{ id: string; label: string }>;
    openSections: Record<string, boolean>;
    onSectionToggle: (section: string) => void;
    onArabicFontPanelOpen: () => void;
  }
): SettingsContentWrapperPropsConfig {
  const coreProps = {
    ...stateProps,
    onTranslationPanelOpen: baseProps.onTranslationPanelOpen,
    onWordLanguagePanelOpen: baseProps.onWordLanguagePanelOpen,
    selectedTranslationName: baseProps.selectedTranslationName,
    selectedWordLanguageName: baseProps.selectedWordLanguageName,
    showTafsirSetting: baseProps.showTafsirSetting,
  };

  // Add optional tafsir props conditionally
  if (baseProps.onTafsirPanelOpen !== undefined) {
    return {
      ...coreProps,
      onTafsirPanelOpen: baseProps.onTafsirPanelOpen,
      selectedTafsirName: baseProps.selectedTafsirName,
    };
  }

  return coreProps;
}
