// app/features/surah/[SurahId]/_components/ArabicFontPanel.tsx
'use client';
import { FaArrowLeft } from '@/app/components/common/SvgIcons';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/app/context/SettingsContext';
import { useState } from 'react'; // Import useState
import { useTheme } from '@/app/context/ThemeContext';

interface ArabicFontPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArabicFontPanel = ({ isOpen, onClose }: ArabicFontPanelProps) => {
  const { settings, setSettings, arabicFonts } = useSettings();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Uthmani'); // State for active tab
  const { theme } = useTheme();

  // Group fonts by category
  const groupedFonts = arabicFonts.reduce(
    (acc, font) => {
      (acc[font.category] = acc[font.category] || []).push(font);
      return acc;
    },
    {} as Record<string, typeof arabicFonts>
  );

  const handleFontSelect = (fontValue: string) => {
    setSettings({ ...settings, arabicFontFace: fontValue });
  };

  const filteredFonts = groupedFonts[activeTab] || [];

  return (
    <>
      {/* No overlay div */}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-[var(--background)] text-[var(--foreground)] flex flex-col transition-transform duration-300 ease-in-out z-50 shadow-lg ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200/80">
          <button
            aria-label="Back"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            <FaArrowLeft size={18} />
          </button>
          <h2 className="font-bold text-lg text-[var(--foreground)]">{t('select_font_face')}</h2>{' '}
          <div className="w-8"></div>
        </div>

        {/* Tab Buttons with updated styling */}
        <div
          className={`flex items-center p-1 rounded-full m-3 ${theme === 'light' ? 'bg-gray-100' : 'bg-slate-800/60'}`}
        >
          {Object.keys(groupedFonts).map((category) => (
            <button
              key={category}
              className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeTab === category
                  ? theme === 'light'
                    ? 'bg-white shadow text-slate-900'
                    : 'bg-slate-700 text-white shadow'
                  : theme === 'light'
                    ? 'text-slate-400 hover:text-slate-700'
                    : 'text-slate-400 hover:text-white'
              }`}
              onClick={() => setActiveTab(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex-grow overflow-y-auto">
          <div className="p-2 space-y-1">
            {filteredFonts.map((font) => (
              <label
                key={font.value}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-teal-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name="arabicFont"
                  className="form-radio h-4 w-4 text-teal-600"
                  checked={settings.arabicFontFace === font.value}
                  onChange={() => handleFontSelect(font.value)}
                />
                <span className="text-sm text-[var(--foreground)]">{font.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
