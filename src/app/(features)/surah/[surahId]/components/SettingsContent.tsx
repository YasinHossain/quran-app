'use client';

import React from 'react';
import { TranslationSettings } from './TranslationSettings';
import { TafsirSettings } from './TafsirSettings';
import { FontSettings } from './FontSettings';
import { SettingsSidebarProps } from './SettingsSidebar';

interface SettingsContentProps
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

export const SettingsContent = ({
  activeTab,
  openSections,
  onSectionToggle,
  onArabicFontPanelOpen,
  onTranslationPanelOpen,
  onWordLanguagePanelOpen,
  onTafsirPanelOpen,
  selectedTranslationName,
  selectedTafsirName,
  selectedWordLanguageName,
  showTafsirSetting = false,
}: SettingsContentProps) => {
  if (activeTab === 'translation') {
    return (
      <>
        <TranslationSettings
          onTranslationPanelOpen={onTranslationPanelOpen}
          onWordLanguagePanelOpen={onWordLanguagePanelOpen}
          selectedTranslationName={selectedTranslationName}
          selectedWordLanguageName={selectedWordLanguageName}
          isOpen={openSections.includes('translation')}
          onToggle={() => onSectionToggle('translation')}
        />
        <TafsirSettings
          onTafsirPanelOpen={onTafsirPanelOpen}
          selectedTafsirName={selectedTafsirName}
          showTafsirSetting={showTafsirSetting}
          isOpen={openSections.includes('tafsir')}
          onToggle={() => onSectionToggle('tafsir')}
        />
        <FontSettings
          onArabicFontPanelOpen={onArabicFontPanelOpen}
          isOpen={openSections.includes('font')}
          onToggle={() => onSectionToggle('font')}
        />
      </>
    );
  }

  if (activeTab === 'reading') {
    return (
      <div className="text-center py-8 text-muted">
        Mushaf settings have been moved to the Translation tab.
      </div>
    );
  }

  return null;
};
