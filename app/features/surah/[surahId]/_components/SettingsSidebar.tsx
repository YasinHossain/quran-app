// app/surah/[surahId]/_components/SettingsSidebar.tsx
import { FaBookReader, FaFontSetting, FaChevronDown } from '@/app/components/common/SvgIcons';
import { CollapsibleSection } from './CollapsibleSection';
import { useSettings } from '@/app/context/SettingsContext';
import { useTranslation } from 'react-i18next';
import { useState } from 'react'; // Import useState
import { ArabicFontPanel } from './ArabicFontPanel'; // Import ArabicFontPanel
import { useTheme } from '@/app/context/ThemeContext';

interface SettingsSidebarProps {
  onTranslationPanelOpen: () => void;
  selectedTranslationName: string;
}

export const SettingsSidebar = ({ onTranslationPanelOpen, selectedTranslationName }: SettingsSidebarProps) => {
  const { settings, setSettings, arabicFonts } = useSettings();
  const { t } = useTranslation();
  const [isArabicFontPanelOpen, setIsArabicFontPanelOpen] = useState(false); // State for ArabicFontPanel
  const { theme, setTheme } = useTheme();

  // Helper function to calculate the slider's progress percentage
  const getPercentage = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  // Calculate percentages for each slider
  const arabicSizePercent = getPercentage(settings.arabicFontSize, 16, 48);
  const translationSizePercent = getPercentage(settings.translationFontSize, 12, 28);

  // Find the selected Arabic font name for display
  const selectedArabicFont = arabicFonts.find(font => font.value === settings.arabicFontFace)?.name || t('select_font');

  return (
    <aside className="w-80 bg-[#F0FAF8] flex-col hidden lg:flex flex-shrink-0 overflow-y-auto shadow-[-5px_0px_15px_-5px_rgba(0,0,0,0.05)]">
      <div className="flex-grow">
        <CollapsibleSection title={t('reading_setting')} icon={<FaBookReader size={20} className="text-teal-700" />}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t('translations')}</label>
            <button onClick={onTranslationPanelOpen} className="w-full flex justify-between items-center bg-white border border-gray-300 rounded-lg p-2.5 text-sm text-left hover:border-teal-500 transition">
              <span className="truncate text-gray-800">{selectedTranslationName}</span>
              <FaChevronDown className="text-gray-500" />
            </button>
          </div>
        </CollapsibleSection>
        <CollapsibleSection title={t('font_setting')} icon={<FaFontSetting size={20} className="text-teal-700" />}>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-sm"><label className="text-gray-700">{t('arabic_font_size')}</label><span className="font-semibold text-teal-700">{settings.arabicFontSize}</span></div>
              <input
                type="range"
                min="16"
                max="48"
                value={settings.arabicFontSize}
                onChange={e => setSettings({ ...settings, arabicFontSize: +e.target.value })}
                style={{ '--value-percent': `${arabicSizePercent}%` } as React.CSSProperties}
              />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm"><label className="text-gray-700">{t('translation_font_size')}</label><span className="font-semibold text-teal-700">{settings.translationFontSize}</span></div>
              <input
                type="range"
                min="12"
                max="28"
                value={settings.translationFontSize}
                onChange={e => setSettings({ ...settings, translationFontSize: +e.target.value })}
                style={{ '--value-percent': `${translationSizePercent}%` } as React.CSSProperties}
              />
            </div>
            {/* Arabic Font Face Selection Button */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">{t('arabic_font_face')}</label>
              <button onClick={() => setIsArabicFontPanelOpen(true)} className="w-full flex justify-between items-center bg-white border border-gray-300 rounded-lg p-2.5 text-sm text-left hover:border-teal-500 transition">
                <span className="truncate text-gray-800">{selectedArabicFont}</span>
                <FaChevronDown className="text-gray-500" />
              </button>
            </div>
          </div>
        </CollapsibleSection>
      </div>
      <div className="p-4 border-t border-gray-200/80">
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm hover:border-teal-500 transition"
        >
          {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
        </button>
      </div>
      {/* Arabic Font Panel */}
      <ArabicFontPanel isOpen={isArabicFontPanelOpen} onClose={() => setIsArabicFontPanelOpen(false)} />
    </aside>
  );
};
