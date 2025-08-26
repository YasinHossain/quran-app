'use client';

import React from 'react';
import { SettingsTabs } from './SettingsTabs';
import { SettingsContent } from './SettingsContent';

interface SettingsContentWrapperProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabOptions: Array<{ id: string; label: string; disabled?: boolean }>;
  openSections: Set<string>;
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

export const SettingsContentWrapper: React.FC<SettingsContentWrapperProps> = ({
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
}) => {
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
          openSections={Array.from(openSections)}
          onSectionToggle={onSectionToggle}
          onArabicFontPanelOpen={onArabicFontPanelOpen}
          onTranslationPanelOpen={onTranslationPanelOpen}
          onWordLanguagePanelOpen={onWordLanguagePanelOpen}
          onTafsirPanelOpen={onTafsirPanelOpen}
          selectedTranslationName={selectedTranslationName}
          selectedTafsirName={selectedTafsirName}
          selectedWordLanguageName={selectedWordLanguageName}
          showTafsirSetting={showTafsirSetting}
        />
      </div>
    </>
  );
};
