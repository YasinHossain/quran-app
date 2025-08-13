'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaFontSetting, FaChevronDown } from '@/app/shared/SvgIcons';
import { CollapsibleSection } from './CollapsibleSection';
import { useSettings } from '@/app/providers/SettingsContext';
import { useFontSize } from '../../hooks/useFontSize';

interface FontSettingsProps {
  onArabicFontPanelOpen: () => void;
}

export const FontSettings = ({ onArabicFontPanelOpen }: FontSettingsProps) => {
  const { settings, setSettings, arabicFonts } = useSettings();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);
  const { style: arabicStyle } = useFontSize(settings.arabicFontSize, 16, 48);
  const { style: translationStyle } = useFontSize(settings.translationFontSize, 12, 28);

  const selectedArabicFont =
    arabicFonts.find((font) => font.value === settings.arabicFontFace)?.name || t('select_font');

  return (
    <CollapsibleSection
      title={t('font_setting')}
      icon={<FaFontSetting size={20} className="text-teal-700" />}
      isLast
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
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
            style={arabicStyle}
          />
        </div>
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <label className="text-[var(--foreground)]">{t('translation_font_size')}</label>
            <span className="font-semibold text-teal-700">{settings.translationFontSize}</span>
          </div>
          <input
            type="range"
            min="12"
            max="28"
            value={settings.translationFontSize}
            onChange={(e) => setSettings({ ...settings, translationFontSize: +e.target.value })}
            style={translationStyle}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-[var(--foreground)]">
            {t('arabic_font_face')}
          </label>
          <button
            onClick={onArabicFontPanelOpen}
            className="w-full flex justify-between items-center bg-[var(--background)] border border-gray-200 dark:border-gray-600 rounded-lg p-2.5 text-sm text-left hover:border-teal-500 transition-shadow shadow-sm hover:shadow-md"
          >
            <span className="truncate text-[var(--foreground)]">{selectedArabicFont}</span>
            <FaChevronDown className="text-gray-500" />
          </button>
        </div>
      </div>
    </CollapsibleSection>
  );
};
