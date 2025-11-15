'use client';

import { SettingsContent } from './SettingsContent';
import { SettingsTabs } from './SettingsTabs';
import { SettingsContentWrapperProps } from './types';

import type { ReactElement } from 'react';

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
  onMushafPanelOpen,
  selectedTranslationName,
  selectedTafsirName,
  selectedWordLanguageName,
  selectedMushafName,
  showTafsirSetting,
  activeTabOverride,
  showTabs,
}: SettingsContentWrapperProps): ReactElement => {
  const resolvedTab = activeTabOverride ?? activeTab;

  return (
    <>
      {/* Tabs section with header separation - matches SurahListContent structure */}
      {showTabs && (
        <div className="p-3 sm:p-4 border-b border-border md:p-3 md:pb-3">
          <SettingsTabs activeTab={resolvedTab} onTabChange={onTabChange} tabOptions={tabOptions} />
        </div>
      )}

      {/* Content section */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-3 touch-pan-y">
        <SettingsContent
          activeTab={resolvedTab}
          openSections={openSections}
          onSectionToggle={onSectionToggle}
          onArabicFontPanelOpen={onArabicFontPanelOpen}
          onTranslationPanelOpen={onTranslationPanelOpen}
          onWordLanguagePanelOpen={onWordLanguagePanelOpen}
          {...(onTafsirPanelOpen !== undefined ? { onTafsirPanelOpen } : {})}
          {...(onMushafPanelOpen !== undefined ? { onMushafPanelOpen } : {})}
          selectedTranslationName={selectedTranslationName}
          {...(selectedTafsirName !== undefined ? { selectedTafsirName } : {})}
          selectedWordLanguageName={selectedWordLanguageName}
          {...(selectedMushafName !== undefined ? { selectedMushafName } : {})}
          showTafsirSetting={showTafsirSetting}
        />
      </div>
    </>
  );
};
