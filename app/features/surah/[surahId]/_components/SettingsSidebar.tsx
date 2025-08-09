'use client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaBookReader,
  FaFontSetting,
  FaChevronDown,
  FaArrowLeft,
  FaTranslation,
} from '@/app/components/common/SvgIcons';
import { CollapsibleSection } from './CollapsibleSection';
import { useSettings } from '@/app/context/SettingsContext';
import { ArabicFontPanel } from './ArabicFontPanel';
import { useSidebar } from '@/app/context/SidebarContext';
import { useTheme } from '@/app/context/ThemeContext';
import { useHeaderVisibility } from '@/app/context/HeaderVisibilityContext';

interface SettingsSidebarProps {
  onTranslationPanelOpen: () => void;
  onWordLanguagePanelOpen: () => void;
  onTafsirPanelOpen?: () => void;
  onReadingPanelOpen?: () => void;
  selectedTranslationName: string;
  selectedTafsirName?: string;
  selectedWordLanguageName: string;
  showTafsirSetting?: boolean;
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
}: SettingsSidebarProps) => {
  const { settings, setSettings, arabicFonts } = useSettings();
  const { t } = useTranslation();
  const [isArabicFontPanelOpen, setIsArabicFontPanelOpen] = useState(false);
  const { isSettingsOpen, setSettingsOpen } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('translation');
  const [openPanels, setOpenPanels] = useState<string[]>(['reading', 'font']);
  const { isHidden } = useHeaderVisibility();

  // Helper function to calculate the slider's progress percentage
  const getPercentage = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  // Calculate percentages for each slider
  const arabicSizePercent = getPercentage(settings.arabicFontSize, 16, 48);
  const translationSizePercent = getPercentage(settings.translationFontSize, 12, 28);
  const tafsirSizePercent = getPercentage(settings.tafsirFontSize, 12, 28);

  // Find the selected Arabic font name for display
  const selectedArabicFont =
    arabicFonts.find((font) => font.value === settings.arabicFontFace)?.name || t('select_font');

  const handleTabClick = (tab: 'translation' | 'reading') => {
    setActiveTab(tab);
    if (tab === 'reading') {
      onReadingPanelOpen?.();
    }
  };

  const togglePanel = (panel: string) => {
    setOpenPanels((prev) => {
      if (prev.includes(panel)) {
        return prev.filter((p) => p !== panel);
      }
      if (prev.length >= 2) {
        return [prev[0], panel];
      }
      return [...prev, panel];
    });
  };

  const isReadingOpen = openPanels.includes('reading');
  const isTafsirOpen = openPanels.includes('tafsir');
  const isFontOpen = openPanels.includes('font');

  return (
    <>
      {/* This is the overlay for mobile view, which closes the sidebar when clicked. */}
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
      {/* This is the main settings sidebar container. */}
      <aside
        className={`fixed lg:static ${isHidden ? 'top-0' : 'top-16'} bottom-0 right-0 w-[20.7rem] bg-[var(--background)] text-[var(--foreground)] flex-col flex-shrink-0 overflow-y-auto overflow-x-hidden shadow-[-5px_0px_15px_-5px_rgba(0,0,0,0.05)] transition-all duration-300 z-40 lg:z-40 lg:h-full ${
          isSettingsOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 ${isSettingsOpen ? 'flex' : 'hidden'} lg:flex`}
      >
        <header className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          <button
            aria-label="Back"
            onClick={() => setSettingsOpen(false)}
            className="p-2 rounded-full hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 lg:hidden"
          >
            <FaArrowLeft size={18} />
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
              className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'translation' ? (theme === 'light' ? 'bg-white shadow text-slate-900' : 'bg-slate-700 text-white shadow') : theme === 'light' ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'}`}
            >
              Translation
            </button>
            <button
              onClick={() => handleTabClick('reading')}
              className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'reading' ? (theme === 'light' ? 'bg-white shadow text-slate-900' : 'bg-slate-700 text-white shadow') : theme === 'light' ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'}`}
            >
              Reading
            </button>
          </div>
          {activeTab === 'translation' && (
            <CollapsibleSection
              title={t('reading_setting')}
              icon={<FaTranslation size={20} className="text-teal-700" />}
              isLast={false}
              isOpen={isReadingOpen}
              onToggle={() => togglePanel('reading')}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-[var(--foreground)]">{t('show_word_by_word')}</span>
                  <button
                    onClick={() => setSettings({ ...settings, showByWords: !settings.showByWords })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.showByWords ? 'bg-teal-600' : 'bg-gray-200'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.showByWords ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--foreground)]">{t('apply_tajweed')}</span>
                  <button
                    onClick={() => setSettings({ ...settings, tajweed: !settings.tajweed })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.tajweed ? 'bg-teal-600' : 'bg-gray-200'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.tajweed ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>

                {/* Translation selection */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-[var(--foreground)]">
                    {t('translations')}
                  </label>
                  <button
                    onClick={onTranslationPanelOpen}
                    className="w-full flex justify-between items-center bg-[var(--background)] border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm text-left hover:border-teal-500 transition"
                  >
                    <span className="truncate text-[var(--foreground)]">
                      {selectedTranslationName}
                    </span>
                    <FaChevronDown className="text-gray-500" />
                  </button>
                </div>

                {/* Word-by-word language selection */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-[var(--foreground)]">
                    {t('word_by_word_language')}
                  </label>
                  <button
                    onClick={onWordLanguagePanelOpen}
                    className="w-full flex justify-between items-center bg-[var(--background)] border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm text-left hover:border-teal-500 transition"
                  >
                    <span className="truncate text-[var(--foreground)]">
                      {selectedWordLanguageName}
                    </span>
                    <FaChevronDown className="text-gray-500" />
                  </button>
                </div>
              </div>
            </CollapsibleSection>
          )}
          {activeTab === 'translation' && showTafsirSetting && (
            <CollapsibleSection
              title={t('tafsir_setting')}
              icon={<FaBookReader size={20} className="text-teal-700" />}
              isLast={false}
              isOpen={isTafsirOpen}
              onToggle={() => togglePanel('tafsir')}
            >
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-[var(--foreground)]">
                    {t('select_tafsir')}
                  </label>
                  <button
                    onClick={onTafsirPanelOpen}
                    className="w-full flex justify-between items-center bg-[var(--background)] border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm text-left hover:border-teal-500 transition"
                  >
                    <span className="truncate text-[var(--foreground)]">{selectedTafsirName}</span>
                    <FaChevronDown className="text-gray-500" />
                  </button>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <label className="text-[var(--foreground)]">{t('tafsir_font_size')}</label>
                    <span className="font-semibold text-teal-700">{settings.tafsirFontSize}</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="28"
                    value={settings.tafsirFontSize}
                    onChange={(e) => setSettings({ ...settings, tafsirFontSize: +e.target.value })}
                    style={{ '--value-percent': `${tafsirSizePercent}%` } as React.CSSProperties}
                  />
                </div>
              </div>
            </CollapsibleSection>
          )}
          {activeTab === 'translation' && (
            <CollapsibleSection
              title={t('font_setting')}
              icon={<FaFontSetting size={20} className="text-teal-700" />}
              isLast={true}
              isOpen={isFontOpen}
              onToggle={() => togglePanel('font')}
            >
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <label className="text-[var(--foreground)]">{t('arabic_font_size')}</label>
                    <span className="font-semibold text-teal-700">{settings.arabicFontSize}</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="48"
                    value={settings.arabicFontSize}
                    onChange={(e) => setSettings({ ...settings, arabicFontSize: +e.target.value })}
                    style={{ '--value-percent': `${arabicSizePercent}%` } as React.CSSProperties}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <label className="text-[var(--foreground)]">{t('translation_font_size')}</label>
                    <span className="font-semibold text-teal-700">
                      {settings.translationFontSize}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="28"
                    value={settings.translationFontSize}
                    onChange={(e) =>
                      setSettings({ ...settings, translationFontSize: +e.target.value })
                    }
                    style={
                      { '--value-percent': `${translationSizePercent}%` } as React.CSSProperties
                    }
                  />
                </div>
                {/* Arabic Font Face Selection Button */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-[var(--foreground)]">
                    {t('arabic_font_face')}
                  </label>
                  <button
                    onClick={() => setIsArabicFontPanelOpen(true)}
                    className="w-full flex justify-between items-center bg-[var(--background)] border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm text-left hover:border-teal-500 transition"
                  >
                    <span className="truncate text-[var(--foreground)]">{selectedArabicFont}</span>
                    <FaChevronDown className="text-gray-500" />
                  </button>
                </div>
              </div>
            </CollapsibleSection>
          )}
          {activeTab === 'reading' && (
            <div className="text-center py-20 text-gray-500">Coming soon...</div>
          )}
        </div>
        {/* Theme Toggle */}
        <div className="p-4">
          <div
            className={`flex items-center p-1 rounded-full ${theme === 'light' ? 'bg-gray-100' : 'bg-slate-800/60'}`}
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
        {/* Arabic Font Panel */}
        <ArabicFontPanel
          isOpen={isArabicFontPanelOpen}
          onClose={() => setIsArabicFontPanelOpen(false)}
        />
      </aside>
    </>
  );
};
