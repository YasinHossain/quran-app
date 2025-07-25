// app/surah/[surahId]/_components/SettingsSidebar.tsx
import {
  FaBookReader,
  FaFontSetting,
  FaChevronDown,
  FaArrowLeft,
} from '@/app/components/common/SvgIcons';
import { CollapsibleSection } from './CollapsibleSection';
import { useSettings } from '@/app/context/SettingsContext';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ArabicFontPanel } from './ArabicFontPanel';
import { useSidebar } from '@/app/context/SidebarContext';
import { useTheme } from '@/app/context/ThemeContext';

interface SettingsSidebarProps {
  onTranslationPanelOpen: () => void;
  onWordTranslationPanelOpen: () => void;
  selectedTranslationName: string;
  selectedWordTranslationName: string;
}

export const SettingsSidebar = ({
  onTranslationPanelOpen,
  onWordTranslationPanelOpen,
  selectedTranslationName,
  selectedWordTranslationName,
}: SettingsSidebarProps) => {
  const { settings, setSettings, arabicFonts } = useSettings();
  const { t } = useTranslation();
  const [isArabicFontPanelOpen, setIsArabicFontPanelOpen] = useState(false);
  const { isSettingsOpen, setSettingsOpen } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'translation' | 'reading'>('translation');

  // Helper function to calculate the slider's progress percentage
  const getPercentage = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  // Calculate percentages for each slider
  const arabicSizePercent = getPercentage(settings.arabicFontSize, 16, 48);
  const translationSizePercent = getPercentage(settings.translationFontSize, 12, 28);

  // Find the selected Arabic font name for display
  const selectedArabicFont =
    arabicFonts.find((font) => font.value === settings.arabicFontFace)?.name || t('select_font');

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-40 lg:hidden ${isSettingsOpen ? '' : 'hidden'}`}
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
        className={`fixed inset-y-0 right-0 w-80 bg-[var(--background)] text-[var(--foreground)] flex flex-col overflow-y-auto overflow-x-hidden shadow-[-5px_0px_15px_-5px_rgba(0,0,0,0.05)] transition-transform duration-300 z-50 rounded-l-[20px] ${
          isSettingsOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        } lg:static lg:block`}
      >
        <header className="p-4 border-b border-gray-200/80">
          <div className="flex items-center justify-between">
            <button
              aria-label="Back"
              onClick={() => setSettingsOpen(false)}
              className="p-2 rounded-full hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              <FaArrowLeft size={18} />
            </button>
            <h2 className="text-lg font-semibold">{t('settings')}</h2>
            <div className="w-8" />
          </div>
          <div className="mt-4 flex justify-center">
            <div className="flex items-center p-1 rounded-full bg-gray-100 dark:bg-slate-800/60">
              <button
                onClick={() => setActiveTab('translation')}
                className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeTab === 'translation'
                    ? 'bg-white shadow text-slate-900 dark:bg-slate-700 dark:text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Translation
              </button>
              <button
                onClick={() => setActiveTab('reading')}
                className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeTab === 'reading'
                    ? 'bg-white shadow text-slate-900 dark:bg-slate-700 dark:text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Reading
              </button>
            </div>
          </div>
        </header>
        <div className="flex-grow">
          {activeTab === 'translation' ? (
            <>
              <CollapsibleSection
                title={t('reading_setting')}
                icon={<FaBookReader size={20} className="text-teal-700" />}
              >
                {/* Translation settings content */}
                {/* ... unchanged content ... */}
              </CollapsibleSection>
              <CollapsibleSection
                title={t('font_setting')}
                icon={<FaFontSetting size={20} className="text-teal-700" />}
              >
                {/* Font settings content */}
                {/* ... unchanged content ... */}
              </CollapsibleSection>
            </>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">Coming Soon</div>
          )}
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
