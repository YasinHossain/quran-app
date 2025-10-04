import type { SettingsContentWrapperProps, SettingsSidebarProps, SettingsTabValue } from '@/app/(features)/surah/components/settings/types';

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
    activeTab: SettingsTabValue;
    onTabChange: (tab: SettingsTabValue) => void;
    tabOptions: Array<{ value: SettingsTabValue; label: string }>;
    openSections: string[];
    onSectionToggle: (section: string) => void;
    onArabicFontPanelOpen: () => void;
  }
): SettingsContentWrapperProps {
  const coreProps: SettingsContentWrapperProps = {
    ...stateProps,
    onTranslationPanelOpen: baseProps.onTranslationPanelOpen,
    onWordLanguagePanelOpen: baseProps.onWordLanguagePanelOpen,
    selectedTranslationName: baseProps.selectedTranslationName,
    selectedWordLanguageName: baseProps.selectedWordLanguageName,
    showTafsirSetting: baseProps.showTafsirSetting ?? false,
  };

  if (baseProps.onTafsirPanelOpen !== undefined) {
    return {
      ...coreProps,
      onTafsirPanelOpen: baseProps.onTafsirPanelOpen,
      ...(baseProps.selectedTafsirName !== undefined
        ? { selectedTafsirName: baseProps.selectedTafsirName }
        : {}),
    };
  }

  return coreProps;
}
