export interface SettingsSidebarProps {
  onTranslationPanelOpen: () => void;
  onWordLanguagePanelOpen: () => void;
  onTafsirPanelOpen?: () => void;
  onReadingPanelOpen?: () => void;
  selectedTranslationName: string;
  selectedTafsirName?: string;
  selectedWordLanguageName: string;
  showTafsirSetting?: boolean | undefined;
  isTranslationPanelOpen?: boolean | undefined;
  onTranslationPanelClose?: () => void;
  isTafsirPanelOpen?: boolean | undefined;
  onTafsirPanelClose?: () => void;
  isWordLanguagePanelOpen?: boolean | undefined;
  onWordLanguagePanelClose?: () => void;
  pageType?: 'verse' | 'tafsir';
}

export type SettingsTabValue = 'translation' | 'reading';

export interface SettingsContentProps
  extends Pick<
    SettingsSidebarProps,
    | 'onTranslationPanelOpen'
    | 'onWordLanguagePanelOpen'
    | 'onTafsirPanelOpen'
    | 'selectedTranslationName'
    | 'selectedTafsirName'
    | 'selectedWordLanguageName'
    | 'showTafsirSetting'
  > {
  activeTab: SettingsTabValue;
  openSections: string[];
  onSectionToggle: (sectionId: string) => void;
  onArabicFontPanelOpen: () => void;
}

export interface SettingsContentWrapperProps {
  activeTab: SettingsTabValue;
  onTabChange: (tab: SettingsTabValue) => void;
  tabOptions: Array<{ value: SettingsTabValue; label: string }>;
  openSections: string[];
  onSectionToggle: (section: string) => void;
  onArabicFontPanelOpen: () => void;
  onTranslationPanelOpen: () => void;
  onWordLanguagePanelOpen: () => void;
  onTafsirPanelOpen?: () => void;
  selectedTranslationName: string;
  selectedTafsirName?: string;
  selectedWordLanguageName: string;
  showTafsirSetting: boolean;
}

export interface SettingsPanelsProps
  extends Pick<
    SettingsSidebarProps,
    | 'isTranslationPanelOpen'
    | 'onTranslationPanelClose'
    | 'isTafsirPanelOpen'
    | 'onTafsirPanelClose'
    | 'isWordLanguagePanelOpen'
    | 'onWordLanguagePanelClose'
  > {
  isArabicFontPanelOpen: boolean;
  onArabicFontPanelClose: () => void;
}
