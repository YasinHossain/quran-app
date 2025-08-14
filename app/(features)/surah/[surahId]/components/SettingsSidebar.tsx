'use client';

import React, { useState } from 'react';
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
import { TranslationPanel } from './TranslationPanel';
import { TafsirPanel } from './TafsirPanel';

interface SettingsSidebarProps {
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
}: SettingsSidebarProps) => {
  const { t } = useTranslation();
  const { isSettingsOpen, setSettingsOpen } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { isHidden } = useHeaderVisibility();
  const [activeTab, setActiveTab] = useState('translation');
  const [isArabicFontPanelOpen, setIsArabicFontPanelOpen] = useState(false);

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
        className={`fixed lg:static top-16 lg:top-0 bottom-0 right-0 w-[20.7rem] bg-[var(--background)] text-[var(--foreground)] flex-col flex-shrink-0 overflow-y-auto overflow-x-hidden shadow-[-5px_0px_15px_-5px_rgba(0,0,0,0.05)] transition-all duration-300 z-40 lg:z-40 lg:h-full ${
          isSettingsOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 ${isSettingsOpen ? 'flex' : 'hidden'} lg:flex`}
        style={{ position: 'relative' }}
      >
        <header className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
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
                    ? 'bg-white shadow text-slate-900'
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
                    ? 'bg-white shadow text-slate-900'
                    : 'bg-slate-700 text-white shadow'
                  : theme === 'light'
                    ? 'text-slate-400 hover:text-slate-700'
                    : 'text-slate-400 hover:text-white'
              }`}
            >
              Reading
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
              />
              <TafsirSettings
                onTafsirPanelOpen={onTafsirPanelOpen}
                selectedTafsirName={selectedTafsirName}
                showTafsirSetting={showTafsirSetting}
              />
              <FontSettings onArabicFontPanelOpen={() => setIsArabicFontPanelOpen(true)} />
            </>
          )}
          {activeTab === 'reading' && <ReadingSettings />}
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
                  ? 'bg-white shadow text-slate-900'
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
          <TranslationPanel
            isOpen={isTranslationPanelOpen}
            onClose={onTranslationPanelClose}
          />
        )}
        {onTafsirPanelClose && (
          <TafsirPanel
            isOpen={isTafsirPanelOpen}
            onClose={onTafsirPanelClose}
          />
        )}
      </aside>
    </>
  );
};
