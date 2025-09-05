'use client';

import { SettingsContent } from './SettingsContent';
import { SettingsTabs } from './SettingsTabs';
import { SettingsContentWrapperProps } from './types';

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
}: SettingsContentWrapperProps): React.JSX.Element => {
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
