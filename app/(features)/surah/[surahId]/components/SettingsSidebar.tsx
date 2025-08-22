'use client';

import React, { useState } from 'react';
import { useSidebar } from '@/app/providers/SidebarContext';
import { SettingsHeader } from './SettingsHeader';
import { SettingsTabs } from './SettingsTabs';
import { SettingsContent } from './SettingsContent';
import { SettingsPanels } from './SettingsPanels';
import { useSettingsTabState } from './hooks/useSettingsTabState';
import { useSettingsSections } from './hooks/useSettingsSections';
import { useScrollbarHiding } from './hooks/useScrollbarHiding';

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
  const { isSettingsOpen, setSettingsOpen } = useSidebar();
  const [isArabicFontPanelOpen, setIsArabicFontPanelOpen] = useState(false);

  const { activeTab, handleTabChange, tabOptions } = useSettingsTabState({
    onReadingPanelOpen,
  });
  const { openSections, handleSectionToggle } = useSettingsSections();
  const { sidebarRef } = useScrollbarHiding();

  return (
    <>
      {/* Mobile drawer overlay */}
      {isSettingsOpen && (
        <div
          className="drawer-overlay lg:hidden"
          onClick={() => setSettingsOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        ref={sidebarRef}
        className={`settings-sidebar fixed top-0 lg:top-16 bottom-0 right-0 w-full sm:w-80 lg:w-[20.7rem] h-screen lg:h-[calc(100vh-4rem)] bg-background text-foreground flex flex-col shadow-modal lg:shadow-lg border-l border-border transition-transform duration-300 ease-in-out overflow-x-hidden pt-safe pb-safe ${
          isSettingsOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 touch-pan-y`}
        style={{
          zIndex: 'var(--z-modal)',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
        role="dialog"
        aria-label="Settings panel"
      >
        <SettingsHeader onClose={() => setSettingsOpen(false)} />

        {/* Content section */}
        <div className="flex-grow p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto scrollbar-hide touch-pan-y">
          <SettingsTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            tabOptions={tabOptions}
          />

          <SettingsContent
            activeTab={activeTab}
            openSections={openSections}
            onSectionToggle={handleSectionToggle}
            onArabicFontPanelOpen={() => setIsArabicFontPanelOpen(true)}
            onTranslationPanelOpen={onTranslationPanelOpen}
            onWordLanguagePanelOpen={onWordLanguagePanelOpen}
            onTafsirPanelOpen={onTafsirPanelOpen}
            selectedTranslationName={selectedTranslationName}
            selectedTafsirName={selectedTafsirName}
            selectedWordLanguageName={selectedWordLanguageName}
            showTafsirSetting={showTafsirSetting}
          />
        </div>

        <SettingsPanels
          isArabicFontPanelOpen={isArabicFontPanelOpen}
          onArabicFontPanelClose={() => setIsArabicFontPanelOpen(false)}
          isTranslationPanelOpen={isTranslationPanelOpen}
          onTranslationPanelClose={onTranslationPanelClose}
          isTafsirPanelOpen={isTafsirPanelOpen}
          onTafsirPanelClose={onTafsirPanelClose}
          isWordLanguagePanelOpen={isWordLanguagePanelOpen}
          onWordLanguagePanelClose={onWordLanguagePanelClose}
        />
      </aside>
    </>
  );
};
