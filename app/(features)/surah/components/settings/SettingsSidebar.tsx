'use client';

import React, { useState } from 'react';
import { useUIState } from '@/app/providers/UIStateContext';
import { BaseSidebar } from '@/app/shared/components/BaseSidebar';
import { SettingsContentWrapper } from './SettingsContentWrapper';
import { SettingsPanels } from './SettingsPanels';
import { useSettingsTabState, useSettingsSections } from '../../hooks';

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

export const SettingsSidebar = ({
  onTranslationPanelOpen,
  onWordLanguagePanelOpen,
  onTafsirPanelOpen,
  onReadingPanelOpen,
  selectedTranslationName,
  selectedTafsirName,
  selectedWordLanguageName,
  showTafsirSetting = false,
  isTranslationPanelOpen = false,
  onTranslationPanelClose,
  isTafsirPanelOpen = false,
  onTafsirPanelClose,
  isWordLanguagePanelOpen = false,
  onWordLanguagePanelClose,
}: SettingsSidebarProps) => {
  const { isSettingsOpen, setSettingsOpen } = useUIState();
  const [isArabicFontPanelOpen, setIsArabicFontPanelOpen] = useState(false);

  const { activeTab, handleTabChange, tabOptions } = useSettingsTabState({
    ...(onReadingPanelOpen !== undefined ? { onReadingPanelOpen } : {}),
  });
  const { openSections, handleSectionToggle } = useSettingsSections();

  return (
    <>
      <BaseSidebar
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        position="right"
        aria-label="Settings panel"
      >
        <SettingsContentWrapper
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabOptions={tabOptions}
          openSections={openSections}
          onSectionToggle={handleSectionToggle}
          onArabicFontPanelOpen={() => setIsArabicFontPanelOpen(true)}
          onTranslationPanelOpen={onTranslationPanelOpen}
          onWordLanguagePanelOpen={onWordLanguagePanelOpen}
          {...(onTafsirPanelOpen !== undefined ? { onTafsirPanelOpen } : {})}
          selectedTranslationName={selectedTranslationName}
          {...(selectedTafsirName !== undefined ? { selectedTafsirName } : {})}
          selectedWordLanguageName={selectedWordLanguageName}
          showTafsirSetting={showTafsirSetting}
        />

        <SettingsPanels
          isArabicFontPanelOpen={isArabicFontPanelOpen}
          onArabicFontPanelClose={() => setIsArabicFontPanelOpen(false)}
          isTranslationPanelOpen={isTranslationPanelOpen}
          {...(onTranslationPanelClose !== undefined ? { onTranslationPanelClose } : {})}
          isTafsirPanelOpen={isTafsirPanelOpen}
          {...(onTafsirPanelClose !== undefined ? { onTafsirPanelClose } : {})}
          isWordLanguagePanelOpen={isWordLanguagePanelOpen}
          {...(onWordLanguagePanelClose !== undefined ? { onWordLanguagePanelClose } : {})}
        />
      </BaseSidebar>
    </>
  );
};

export default SettingsSidebar;
