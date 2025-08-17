'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontSettingIcon } from '@/app/shared/icons';
import { CollapsibleSection } from './CollapsibleSection';
import { useSettings } from '@/app/providers/SettingsContext';
import { useFontSize } from '../../hooks/useFontSize';
import SelectionBox from '@/app/shared/SelectionBox';

interface FontSettingsProps {
  onArabicFontPanelOpen: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const FontSettings = ({
  onArabicFontPanelOpen,
  isOpen = false,
  onToggle,
}: FontSettingsProps) => {
  const { settings, setSettings, arabicFonts } = useSettings();
  const { t } = useTranslation();
  const { style: arabicStyle } = useFontSize(settings.arabicFontSize, 16, 48);
  const { style: translationStyle } = useFontSize(settings.translationFontSize, 12, 28);

  const selectedArabicFont =
    arabicFonts.find((font) => font.value === settings.arabicFontFace)?.name || t('select_font');

  return (
    <CollapsibleSection
      title={t('font_setting')}
      icon={<FontSettingIcon size={20} className="text-teal-700" />}
      isLast
      isOpen={isOpen}
      onToggle={onToggle || (() => {})}
    >
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <label className="text-primary">{t('arabic_font_size')}</label>
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
            <label className="text-primary">{t('translation_font_size')}</label>
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
        <SelectionBox
          label={t('arabic_font_face')}
          value={selectedArabicFont}
          onClick={onArabicFontPanelOpen}
        />
      </div>
    </CollapsibleSection>
  );
};
