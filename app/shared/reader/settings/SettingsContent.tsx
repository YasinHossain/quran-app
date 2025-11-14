'use client';

import React from 'react';

import { FontSettings } from './FontSettings';
import { TafsirSettings } from './TafsirSettings';
import { TranslationSettings } from './TranslationSettings';
import { SettingsContentProps } from './types';

import type { ReactElement } from 'react';

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
}: SettingsContentProps): ReactElement => {
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
          {...(onTafsirPanelOpen !== undefined ? { onTafsirPanelOpen } : {})}
          {...(selectedTafsirName !== undefined ? { selectedTafsirName } : {})}
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

  return <></>;
};
