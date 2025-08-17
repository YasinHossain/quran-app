'use client';

import React, { useState, useRef } from 'react';
import { useSidebar } from '@/app/providers/SidebarContext';
import { useTheme } from '@/app/providers/ThemeContext';
import { useOpenSections } from './useOpenSections';
import { useHideScrollbar } from '../../hooks/useHideScrollbar';
import { SidebarOverlay } from './SidebarOverlay';
import { SidebarContent } from './SidebarContent';

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

export const SettingsSidebar = (props: SettingsSidebarProps) => {
  const { isSettingsOpen, setSettingsOpen } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'translation' | 'reading'>('translation');
  const [isArabicFontPanelOpen, setIsArabicFontPanelOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const { openSections, toggleSection } = useOpenSections();

  useHideScrollbar(sidebarRef, 'settings-sidebar');

  const handleTabClick = (tab: 'translation' | 'reading') => {
    setActiveTab(tab);
    if (tab === 'reading') {
      props.onReadingPanelOpen?.();
    }
  };

  return (
    <>
      <SidebarOverlay isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
      <SidebarContent
        ref={sidebarRef}
        {...props}
        isOpen={isSettingsOpen}
        activeTab={activeTab}
        onTabClick={handleTabClick}
        openSections={openSections}
        onToggleSection={toggleSection}
        isArabicFontPanelOpen={isArabicFontPanelOpen}
        setIsArabicFontPanelOpen={setIsArabicFontPanelOpen}
        theme={theme}
        setTheme={setTheme}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
};
