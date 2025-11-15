import type { MushafOption } from '@/types';

export interface SettingsSidebarProps {
  onTranslationPanelOpen: () => void;
  onWordLanguagePanelOpen: () => void;
  onTafsirPanelOpen?: () => void;
  onReadingPanelOpen?: () => void;
  onTranslationTabOpen?: () => void;
  onMushafPanelOpen?: () => void;
  selectedTranslationName: string;
  selectedTafsirName?: string;
  selectedWordLanguageName: string;
  selectedMushafName?: string;
  selectedMushafId?: string;
  showTafsirSetting?: boolean | undefined;
  isTranslationPanelOpen?: boolean | undefined;
  onTranslationPanelClose?: () => void;
  isTafsirPanelOpen?: boolean | undefined;
  onTafsirPanelClose?: () => void;
  isWordLanguagePanelOpen?: boolean | undefined;
  onWordLanguagePanelClose?: () => void;
  isMushafPanelOpen?: boolean | undefined;
  onMushafPanelClose?: () => void;
  mushafOptions?: MushafOption[];
  onMushafChange?: (mushafId: string) => void;
  pageType: 'verse' | 'tafsir' | 'bookmarks';
  activeReaderMode?: 'translation' | 'reading';
  readerTabsEnabled?: boolean;
}

export type SettingsTabValue = 'translation' | 'reading';

export interface SettingsContentProps
  extends Pick<
    SettingsSidebarProps,
    | 'onTranslationPanelOpen'
    | 'onWordLanguagePanelOpen'
    | 'onTafsirPanelOpen'
    | 'onMushafPanelOpen'
    | 'selectedTranslationName'
    | 'selectedTafsirName'
    | 'selectedWordLanguageName'
    | 'selectedMushafName'
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
  onMushafPanelOpen?: () => void;
  selectedTranslationName: string;
  selectedTafsirName?: string;
  selectedWordLanguageName: string;
  selectedMushafName?: string;
  showTafsirSetting: boolean;
  activeTabOverride?: SettingsTabValue;
  showTabs: boolean;
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
    | 'isMushafPanelOpen'
    | 'onMushafPanelClose'
    | 'mushafOptions'
    | 'selectedMushafId'
    | 'onMushafChange'
  > {
  isArabicFontPanelOpen: boolean;
  onArabicFontPanelClose: () => void;
}
