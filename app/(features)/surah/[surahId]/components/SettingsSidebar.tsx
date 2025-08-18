'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '@/app/shared/icons';
import { useSidebar } from '@/app/providers/SidebarContext';
import { useTheme } from '@/app/providers/ThemeContext';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { ArabicFontPanel } from './ArabicFontPanel';
import { TranslationSettings } from './TranslationSettings';
import { TafsirSettings } from './TafsirSettings';
import { FontSettings } from './FontSettings';
import { ReadingSettings } from './ReadingSettings';
import { TranslationPanel } from './translation-panel';
import { TafsirPanel } from './tafsir-panel';
import { WordLanguagePanel } from './WordLanguagePanel';

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
  pageType,
}: SettingsSidebarProps) => {
  const { t } = useTranslation();
  const { isSettingsOpen, setSettingsOpen } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { isHidden } = useHeaderVisibility();
  const [activeTab, setActiveTab] = useState('translation');
  const [isArabicFontPanelOpen, setIsArabicFontPanelOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  // State for collapsible sections with localStorage persistence
  const [openSections, setOpenSections] = useState<string[]>(() => {
    // Try to get saved preferences from localStorage
    try {
      const saved = localStorage.getItem('settings-sidebar-open-sections');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to parse saved sidebar sections:', error);
    }

    // Default open sections - both translation and font should be open by default
    return ['translation', 'font'];
  });

  // Function to handle section toggle with max 2 open rule and localStorage persistence
  const handleSectionToggle = (sectionId: string) => {
    console.log('Toggling section:', sectionId, 'Current open:', openSections);
    setOpenSections((prev) => {
      let newState: string[];

      if (prev.includes(sectionId)) {
        // If section is open, close it
        newState = prev.filter((id) => id !== sectionId);
        console.log('Closing section, new state:', newState);
      } else {
        // If section is closed, open it
        if (prev.length >= 2) {
          // If already 2 sections open, remove the oldest one and add the new one
          newState = [prev[1], sectionId];
        } else {
          // If less than 2 sections open, just add the new one
          newState = [...prev, sectionId];
        }
        console.log('Opening section, new state:', newState);
      }

      // Save to localStorage
      try {
        localStorage.setItem('settings-sidebar-open-sections', JSON.stringify(newState));
      } catch (error) {
        console.warn('Failed to save sidebar sections to localStorage:', error);
      }

      return newState;
    });
  };

  useEffect(() => {
    if (sidebarRef.current) {
      const sidebar = sidebarRef.current;
      // Hide scrollbar with inline styles
      const styleDecl = sidebar.style as CSSStyleDeclaration & {
        msOverflowStyle?: string;
        scrollbarWidth?: string;
      };
      styleDecl.msOverflowStyle = 'none';
      styleDecl.scrollbarWidth = 'none';
      // Add style tag for webkit scrollbar
      const style = document.createElement('style');
      style.textContent = `
        .settings-sidebar::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `;
      document.head.appendChild(style);
      return () => {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    }
  }, []);

  const handleTabClick = (tab: 'translation' | 'reading') => {
    setActiveTab(tab);
    if (tab === 'reading') {
      onReadingPanelOpen?.();
    }
  };

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
        className={`settings-sidebar fixed lg:static top-16 lg:top-0 bottom-0 right-0 w-[20.7rem] bg-surface text-primary flex-col flex-shrink-0 overflow-y-auto overflow-x-hidden shadow-[-5px_0px_15px_-5px_rgba(0,0,0,0.05)] transition-all duration-300 z-40 lg:z-40 lg:h-full ${
          isSettingsOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 ${isSettingsOpen ? 'flex' : 'hidden'} lg:flex scrollbar-hide`}
        style={{
          position: 'relative',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        <header className="flex items-center justify-between p-4 border-b border-border">
          <button
            aria-label="Back"
            onClick={() => setSettingsOpen(false)}
            className="p-2 rounded-full hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 lg:hidden"
          >
            <ArrowLeftIcon size={18} />
          </button>
          <h2 className="flex-grow text-center text-lg font-bold">Settings</h2>
          <div className="w-8" />
        </header>
        <div className="flex-grow p-4 space-y-4">
          <div
            className={`flex items-center p-1 rounded-full mb-4 ${theme === 'light' ? 'bg-gray-100' : 'bg-slate-800/60'}`}
          >
            <button
              onClick={() => handleTabClick('translation')}
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
              onClick={() => handleTabClick('reading')}
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
                onToggle={() => handleSectionToggle('translation')}
              />
              <TafsirSettings
                onTafsirPanelOpen={onTafsirPanelOpen}
                selectedTafsirName={selectedTafsirName}
                showTafsirSetting={showTafsirSetting}
                isOpen={openSections.includes('tafsir')}
                onToggle={() => handleSectionToggle('tafsir')}
              />
              <FontSettings
                onArabicFontPanelOpen={() => setIsArabicFontPanelOpen(true)}
                isOpen={openSections.includes('font')}
                onToggle={() => handleSectionToggle('font')}
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
    </>
  );
};
