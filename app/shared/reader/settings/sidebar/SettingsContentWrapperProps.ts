import type {
  SettingsContentWrapperProps,
  SettingsSidebarProps,
  SettingsTabValue,
} from '@/app/shared/reader/settings/types';

export function buildContentWrapperProps(
  baseProps: Pick<
    SettingsSidebarProps,
    | 'onTranslationPanelOpen'
    | 'onTafsirPanelOpen'
    | 'onWordLanguagePanelOpen'
    | 'onMushafPanelOpen'
    | 'selectedTranslationName'
    | 'selectedTafsirName'
    | 'selectedWordLanguageName'
    | 'selectedMushafName'
    | 'showTafsirSetting'
  >,
  stateProps: {
    activeTab: SettingsTabValue;
    onTabChange: (tab: SettingsTabValue) => void;
    tabOptions: Array<{ value: SettingsTabValue; label: string }>;
    openSections: string[];
    onSectionToggle: (section: string) => void;
    onArabicFontPanelOpen: () => void;
    activeTabOverride?: SettingsTabValue;
    showTabs: boolean;
  }
): SettingsContentWrapperProps {
  const coreProps: SettingsContentWrapperProps = {
    ...stateProps,
    onTranslationPanelOpen: baseProps.onTranslationPanelOpen,
    onWordLanguagePanelOpen: baseProps.onWordLanguagePanelOpen,
    selectedTranslationName: baseProps.selectedTranslationName,
    selectedWordLanguageName: baseProps.selectedWordLanguageName,
    selectedMushafName: baseProps.selectedMushafName ?? '',
    showTafsirSetting: baseProps.showTafsirSetting ?? false,
  };

  if (baseProps.onMushafPanelOpen) {
    coreProps.onMushafPanelOpen = baseProps.onMushafPanelOpen;
  }

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
