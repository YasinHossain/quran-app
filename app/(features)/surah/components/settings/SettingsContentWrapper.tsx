'use client';

import { SettingsTabs } from './SettingsTabs';
import { SettingsContent } from './SettingsContent';

interface SettingsContentWrapperProps {
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

export const SettingsContentWrapper = ({
  activeTab,
  onTabChange,
  tabOptions,
  openSections,
  onSectionToggle,
  onArabicFontPanelOpen,
  onTranslationPanelOpen,
  onWordLanguagePanelOpen,
  onTafsirPanelOpen,
  selectedTranslationName,
  selectedTafsirName,
  selectedWordLanguageName,
  showTafsirSetting,
}: SettingsContentWrapperProps): JSX.Element => {
  return (
    <>
      {/* Tabs section with header separation - matches SurahListContent structure */}
      <div className="p-3 sm:p-4 border-b border-border md:p-3 md:pb-3">
        <SettingsTabs activeTab={activeTab} onTabChange={onTabChange} tabOptions={tabOptions} />
      </div>

      {/* Content section */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-3 touch-pan-y">
        <SettingsContent
          activeTab={activeTab}
          openSections={openSections}
          onSectionToggle={onSectionToggle}
          onArabicFontPanelOpen={onArabicFontPanelOpen}
          onTranslationPanelOpen={onTranslationPanelOpen}
          onWordLanguagePanelOpen={onWordLanguagePanelOpen}
          {...(onTafsirPanelOpen !== undefined ? { onTafsirPanelOpen } : {})}
          selectedTranslationName={selectedTranslationName}
          {...(selectedTafsirName !== undefined ? { selectedTafsirName } : {})}
          selectedWordLanguageName={selectedWordLanguageName}
          showTafsirSetting={showTafsirSetting}
        />
      </div>
    </>
  );
};
