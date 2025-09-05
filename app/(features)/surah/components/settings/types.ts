export interface SettingsSidebarProps {
  onTranslationPanelOpen: () => void;
  onWordLanguagePanelOpen: () => void;
  onTafsirPanelOpen?: () => void;
  onReadingPanelOpen?: () => void;
  selectedTranslationName: string;
  selectedTafsirName?: string;
  selectedWordLanguageName: string;
  showTafsirSetting?: boolean;
  isTranslationPanelOpen?: boolean;
  onTranslationPanelClose?: () => void;
  isTafsirPanelOpen?: boolean;
  onTafsirPanelClose?: () => void;
  isWordLanguagePanelOpen?: boolean;
  onWordLanguagePanelClose?: () => void;
  pageType?: 'verse' | 'tafsir';
}

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
  activeTab: string;
  openSections: string[];
  onSectionToggle: (sectionId: string) => void;
  onArabicFontPanelOpen: () => void;
}

export interface SettingsContentWrapperProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabOptions: Array<{ value: string; label: string }>;
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
