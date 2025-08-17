'use client';

import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '@/app/shared/icons';
import { ArabicFontPanel } from './ArabicFontPanel';
import { TranslationSettings } from './TranslationSettings';
import { TafsirSettings } from './TafsirSettings';
import { FontSettings } from './FontSettings';
import { TranslationPanel } from './translation-panel';
import { TafsirPanel } from './tafsir-panel';
import { WordLanguagePanel } from './WordLanguagePanel';
import type { SettingsSidebarProps } from './SettingsSidebar';

interface SidebarContentProps extends SettingsSidebarProps {
  isOpen: boolean;
  activeTab: 'translation' | 'reading';
  onTabClick: (tab: 'translation' | 'reading') => void;
  openSections: string[];
  onToggleSection: (sectionId: string) => void;
  isArabicFontPanelOpen: boolean;
  setIsArabicFontPanelOpen: (open: boolean) => void;
  theme: string;
  setTheme: (theme: 'light' | 'dark') => void;
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
      theme,
      setTheme,
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
    const { t } = useTranslation();
    return (
      <aside
        ref={ref}
        className={`settings-sidebar fixed lg:static top-16 lg:top-0 bottom-0 right-0 w-[20.7rem] bg-surface text-primary flex-col flex-shrink-0 overflow-y-auto overflow-x-hidden shadow-[-5px_0px_15px_-5px_rgba(0,0,0,0.05)] transition-all duration-300 z-40 lg:z-40 lg:h-full ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 ${isOpen ? 'flex' : 'hidden'} lg:flex scrollbar-hide`}
        style={{ position: 'relative' }}
      >
        <header className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          <button
            aria-label="Back"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 lg:hidden"
          >
            <ArrowLeftIcon size={18} />
          </button>
          <h2 className="flex-grow text-center text-lg font-bold">Settings</h2>
          <div className="w-8" />
        </header>
        <div className="flex-grow p-4 space-y-4">
          <div
            className={`flex items-center p-1 rounded-full mb-4 ${
              theme === 'light' ? 'bg-gray-100' : 'bg-slate-800/60'
            }`}
          >
            <button
              onClick={() => onTabClick('translation')}
              className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeTab === 'translation'
                  ? theme === 'light'
                    ? 'bg-surface shadow text-slate-900'
                    : 'bg-slate-700 text-white shadow'
                  : theme === 'light'
                    ? 'text-slate-400 hover:text-slate-700'
                    : 'text-slate-400 hover:text-white'
              }`}
            >
              Translation
            </button>
            <button
              onClick={() => onTabClick('reading')}
              className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeTab === 'reading'
                  ? theme === 'light'
                    ? 'bg-surface shadow text-slate-900'
                    : 'bg-slate-700 text-white shadow'
                  : theme === 'light'
                    ? 'text-slate-400 hover:text-slate-700'
                    : 'text-slate-400 hover:text-white'
              }`}
            >
              Mushaf
            </button>
          </div>
          {activeTab === 'translation' && (
            <>
              <TranslationSettings
                onTranslationPanelOpen={onTranslationPanelOpen}
                onWordLanguagePanelOpen={onWordLanguagePanelOpen}
                onTafsirPanelOpen={onTafsirPanelOpen}
                selectedTranslationName={selectedTranslationName}
                selectedTafsirName={selectedTafsirName}
                selectedWordLanguageName={selectedWordLanguageName}
                showTafsirSetting={showTafsirSetting}
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
        <div className="p-4">
          <div
            className={`flex items-center p-1 rounded-full ${
              theme === 'light' ? 'bg-gray-100' : 'bg-slate-800/60'
            }`}
          >
            <button
              onClick={() => setTheme('light')}
              className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                theme === 'light'
                  ? 'bg-surface shadow text-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('light_mode')}
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-700 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('dark_mode')}
            </button>
          </div>
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
