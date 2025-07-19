// app/surah/[surahId]/_components/SettingsSidebar.tsx
import { FaBookReader, FaFontSetting, FaChevronDown } from '@/app/components/SvgIcons';
import { CollapsibleSection } from './CollapsibleSection';
import { Settings } from '@/types';

interface SettingsSidebarProps {
  settings: Settings;
  onSettingsChange: (newSettings: Settings) => void;
  onTranslationPanelOpen: () => void;
  selectedTranslationName: string;
  arabicFonts: { name: string; value: string; }[];
}

export const SettingsSidebar = ({ settings, onSettingsChange, onTranslationPanelOpen, selectedTranslationName, arabicFonts }: SettingsSidebarProps) => {
  
  // Helper function to calculate the slider's progress percentage
  const getPercentage = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  // Calculate percentages for each slider
  const arabicSizePercent = getPercentage(settings.arabicFontSize, 16, 48);
  const translationSizePercent = getPercentage(settings.translationFontSize, 12, 28);

  return (
    <aside className="w-80 bg-[#F0FAF8] flex-col hidden lg:flex flex-shrink-0 overflow-y-auto shadow-[-5px_0px_15px_-5px_rgba(0,0,0,0.05)]">
      <div className="flex-grow">
        <CollapsibleSection title="Reading Setting" icon={<FaBookReader size={20} className="text-teal-700" />}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Translations</label>
            <button onClick={onTranslationPanelOpen} className="w-full flex justify-between items-center bg-white border border-gray-300 rounded-lg p-2.5 text-sm text-left hover:border-teal-500 transition">
              <span className="truncate text-gray-800">{selectedTranslationName}</span>
              <FaChevronDown className="text-gray-500" />
            </button>
          </div>
        </CollapsibleSection>
        <CollapsibleSection title="Font Setting" icon={<FaFontSetting size={20} className="text-teal-700" />}>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-sm"><label className="text-gray-700">Arabic Font Size</label><span className="font-semibold text-teal-700">{settings.arabicFontSize}</span></div>
              <input
                type="range"
                min="16"
                max="48"
                value={settings.arabicFontSize}
                onChange={e => onSettingsChange({ ...settings, arabicFontSize: +e.target.value })}
                // CHANGE: Apply the percentage as a CSS variable
                style={{ '--value-percent': `${arabicSizePercent}%` } as React.CSSProperties}
              />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm"><label className="text-gray-700">Translation Font Size</label><span className="font-semibold text-teal-700">{settings.translationFontSize}</span></div>
              <input
                type="range"
                min="12"
                max="28"
                value={settings.translationFontSize}
                onChange={e => onSettingsChange({ ...settings, translationFontSize: +e.target.value })}
                // CHANGE: Apply the percentage as a CSS variable
                style={{ '--value-percent': `${translationSizePercent}%` } as React.CSSProperties}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Arabic Font Face</label>
              <select onChange={e => onSettingsChange({ ...settings, arabicFontFace: e.target.value })} value={settings.arabicFontFace} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:border-teal-500 text-gray-800">
                {arabicFonts.map(font => (<option key={font.name} value={font.value}>{font.name}</option>))}
              </select>
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </aside>
  );
};

