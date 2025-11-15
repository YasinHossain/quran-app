'use client';

import React from 'react';

import { FontSettings } from './FontSettings';
import { TafsirSettings } from './TafsirSettings';
import { TranslationSettings } from './TranslationSettings';
import { MushafSettings } from './MushafSettings';
import { SettingsContentProps } from './types';

import { cn } from '@/lib/utils/cn';

import type { ReactElement } from 'react';

export const SettingsContent = ({
  activeTab,
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
  selectedMushafName = '',
  showTafsirSetting = false,
}: SettingsContentProps): ReactElement => {
  const mushafVisible = activeTab === 'reading';

  const baseSettings = (
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

  return (
    <>
      <div
        data-testid="mushaf-settings-wrapper"
        aria-hidden={!mushafVisible}
        className={cn(
          'transition-all duration-300',
          mushafVisible ? 'max-h-[999px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'
        )}
      >
        <MushafSettings
          selectedMushafName={selectedMushafName}
          onMushafPanelOpen={onMushafPanelOpen || (() => {})}
          isOpen={openSections.includes('mushaf')}
          onToggle={() => onSectionToggle('mushaf')}
        />
      </div>
      {baseSettings}
    </>
  );
};
