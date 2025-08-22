'use client';

import React, { forwardRef } from 'react';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { ArrowLeftIcon } from '@/app/shared/icons';
import { ArabicFontPanel } from './ArabicFontPanel';
import { TranslationSettings } from './TranslationSettings';
import { TafsirSettings } from './TafsirSettings';
import { FontSettings } from './FontSettings';
import { TranslationPanel } from './translation-panel';
import { TafsirPanel } from './tafsir-panel';
import { WordLanguagePanel } from './WordLanguagePanel';
import { TabToggle } from '@/app/shared/ui/TabToggle';
import type { SettingsSidebarProps } from './SettingsSidebar';

interface SidebarContentProps extends SettingsSidebarProps {
  isOpen: boolean;
  activeTab: 'translation' | 'reading';
  onTabClick: (tab: 'translation' | 'reading') => void;
  openSections: string[];
  onToggleSection: (sectionId: string) => void;
  isArabicFontPanelOpen: boolean;
  setIsArabicFontPanelOpen: (open: boolean) => void;
  onClose: () => void;
}

export const SidebarContent = forwardRef<HTMLElement, SidebarContentProps>(
  (
    {
      isOpen,
      activeTab,
      onTabClick,
      openSections,
      onToggleSection,
      isArabicFontPanelOpen,
      setIsArabicFontPanelOpen,
      onTranslationPanelOpen,
      onWordLanguagePanelOpen,
      onTafsirPanelOpen,
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
      onClose,
    },
    ref
  ) => {
    const { isHidden } = useHeaderVisibility();

    return (
      <aside
        ref={ref}
        className={`settings-sidebar fixed lg:static ${isHidden ? 'top-0' : 'top-16'} lg:top-0 bottom-0 right-0 w-72 sm:w-80 md:w-[20.7rem] bg-surface text-foreground flex-col flex-shrink-0 overflow-y-auto overflow-x-hidden shadow-[-5px_0px_15px_-5px_rgba(0,0,0,0.05)] transition-all duration-300 z-40 lg:z-40 lg:h-full ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 ${isOpen ? 'flex' : 'hidden'} lg:flex scrollbar-hide`}
        style={{ position: 'relative' }}
      >
        <header className="flex items-center justify-between p-4 border-b border-border">
          <button
            aria-label="Back"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden"
          >
            <ArrowLeftIcon size={18} />
          </button>
          <h2 className="flex-grow text-center text-lg font-bold">Settings</h2>
          <div className="w-8" />
        </header>
        <div className="flex-grow p-4 space-y-4">
          <TabToggle
            options={[
              { value: 'translation', label: 'Translation' },
              { value: 'reading', label: 'Mushaf' },
            ]}
            value={activeTab}
            onChange={(tab) => onTabClick(tab as 'translation' | 'reading')}
            className="mb-4"
          />
          {activeTab === 'translation' && (
            <>
              <TranslationSettings
                onTranslationPanelOpen={onTranslationPanelOpen}
                onWordLanguagePanelOpen={onWordLanguagePanelOpen}
                selectedTranslationName={selectedTranslationName}
                selectedWordLanguageName={selectedWordLanguageName}
                isOpen={openSections.includes('translation')}
                onToggle={() => onToggleSection('translation')}
              />
              <TafsirSettings
                onTafsirPanelOpen={onTafsirPanelOpen}
                selectedTafsirName={selectedTafsirName}
                showTafsirSetting={showTafsirSetting}
                isOpen={openSections.includes('tafsir')}
                onToggle={() => onToggleSection('tafsir')}
              />
              <FontSettings
                onArabicFontPanelOpen={() => setIsArabicFontPanelOpen(true)}
                isOpen={openSections.includes('font')}
                onToggle={() => onToggleSection('font')}
              />
            </>
          )}
          {activeTab === 'reading' && (
            <div className="text-center py-8 text-muted">
              Mushaf settings have been moved to the Translation tab.
            </div>
          )}
        </div>
        <ArabicFontPanel
          isOpen={isArabicFontPanelOpen}
          onClose={() => setIsArabicFontPanelOpen(false)}
        />
        {onTranslationPanelClose && (
          <TranslationPanel isOpen={isTranslationPanelOpen} onClose={onTranslationPanelClose} />
        )}
        {onTafsirPanelClose && (
          <TafsirPanel isOpen={isTafsirPanelOpen} onClose={onTafsirPanelClose} />
        )}
        {onWordLanguagePanelClose && (
          <WordLanguagePanel isOpen={isWordLanguagePanelOpen} onClose={onWordLanguagePanelClose} />
        )}
      </aside>
    );
  }
);

SidebarContent.displayName = 'SidebarContent';
