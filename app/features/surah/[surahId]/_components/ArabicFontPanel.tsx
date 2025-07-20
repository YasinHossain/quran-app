// app/features/surah/[SurahId]/_components/ArabicFontPanel.tsx
'use client';
import { FaArrowLeft, FaCheck } from '@/app/components/common/SvgIcons'; // Import FaCheck
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/app/context/SettingsContext';
import { useState } from 'react'; // Import useState

interface ArabicFontPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArabicFontPanel = ({ isOpen, onClose }: ArabicFontPanelProps) => {
  const { settings, setSettings, arabicFonts } = useSettings();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Uthmani'); // State for active tab

  // Group fonts by category
  const groupedFonts = arabicFonts.reduce((acc, font) => {
    (acc[font.category] = acc[font.category] || []).push(font);
    return acc;
  }, {} as Record<string, typeof arabicFonts>);

  const handleFontSelect = (fontValue: string) => {
    setSettings({ ...settings, arabicFontFace: fontValue });
    // onClose(); // Keep panel open after selection for better user experience
  };

  const filteredFonts = groupedFonts[activeTab] || [];

  return (
    <>
      {/* No overlay div */}
      <div className={`fixed top-0 right-0 w-80 h-full bg-[#F7F9F9] flex flex-col transition-transform duration-300 ease-in-out z-50 shadow-lg ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200/80">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><FaArrowLeft size={18} /></button>
          <h2 className="font-bold text-lg text-gray-800">{t('select_font_face')}</h2> {/* Assuming a translation key for the title */}
          <div className="w-8"></div>
        </div>
        
        {/* Tab Buttons */}
        <div className="flex justify-center p-3 space-x-2 bg-gray-100 border-b border-gray-200/80">
          {Object.keys(groupedFonts).map(category => (
            <button
              key={category}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${activeTab === category ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              onClick={() => setActiveTab(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex-grow overflow-y-auto">
          <div className="p-2 space-y-1">
            {filteredFonts.map(font => (
              <button
                key={font.value}
                className={`flex items-center justify-between w-full p-2 rounded-md hover:bg-teal-50 cursor-pointer ${settings.arabicFontFace === font.value ? 'bg-teal-100' : ''}`}
                onClick={() => handleFontSelect(font.value)}
              >
                <span className="text-sm text-gray-700" style={{ fontFamily: font.value }}>{font.name}</span> {/* Apply font family for preview */}
                {settings.arabicFontFace === font.value && <FaCheck size={16} className="text-teal-600" />} {/* Checkmark for selected font */}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
