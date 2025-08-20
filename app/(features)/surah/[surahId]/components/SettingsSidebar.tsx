'use client';

import React, { useState } from 'react';
import { useSidebar } from '@/app/providers/SidebarContext';
import { ThemeSelector } from '@/app/shared/ui/ThemeSelector';
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
      <div
        className={`fixed inset-0 bg-transparent z-30 lg:hidden ${isSettingsOpen ? '' : 'hidden'}`}
        role="button"
        tabIndex={0}
        onClick={() => setSettingsOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
            setSettingsOpen(false);
          }
        }}
      />
      <aside
        ref={sidebarRef}
        className={`settings-sidebar fixed md:static top-0 md:top-0 md:mt-16 bottom-0 right-0 w-80 sm:w-[20.7rem] bg-background text-foreground flex-col flex-shrink-0 overflow-y-auto overflow-x-hidden shadow-[-5px_0px_15px_-5px_rgba(0,0,0,0.05)] transition-all duration-300 md:h-full ${
          isSettingsOpen ? 'translate-x-0' : 'translate-x-full'
        } md:translate-x-0 ${isSettingsOpen ? 'flex' : 'hidden'} md:flex scrollbar-hide`}
        style={{
          zIndex: 'var(--z-modal)',
          position: 'relative',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        <SettingsHeader onClose={() => setSettingsOpen(false)} />

        <div className="flex-grow p-4 space-y-4">
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

        <div className="p-4">
          <ThemeSelector />
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
