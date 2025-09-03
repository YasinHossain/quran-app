'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontSettingIcon } from '@/app/shared/icons';
import { CollapsibleSection } from '../CollapsibleSection';
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
  const [isClient, setIsClient] = useState(false);
  const { style: arabicStyle } = useFontSize(settings.arabicFontSize, 16, 48);
  const { style: translationStyle } = useFontSize(settings.translationFontSize, 12, 28);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const selectedArabicFont = isClient
    ? arabicFonts.find((font) => font.value === settings.arabicFontFace)?.name || t('select_font')
    : '';

  return (
    <CollapsibleSection
      title={t('font_setting')}
      icon={<FontSettingIcon size={20} className="text-accent" />}
      isLast
      isOpen={isOpen}
      onToggle={onToggle || (() => {})}
    >
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <label className="text-foreground">{t('arabic_font_size')}</label>
            <span className="font-semibold text-accent" suppressHydrationWarning>
              {isClient ? settings.arabicFontSize : 28}
            </span>
          </div>
          <input
            type="range"
            min="16"
            max="48"
            value={isClient ? settings.arabicFontSize : 28}
            onChange={(e) => setSettings({ ...settings, arabicFontSize: +e.target.value })}
            style={arabicStyle}
            suppressHydrationWarning
          />
        </div>
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <label className="text-foreground">{t('translation_font_size')}</label>
            <span className="font-semibold text-accent" suppressHydrationWarning>
              {isClient ? settings.translationFontSize : 16}
            </span>
          </div>
          <input
            type="range"
            min="12"
            max="28"
            value={isClient ? settings.translationFontSize : 16}
            onChange={(e) => setSettings({ ...settings, translationFontSize: +e.target.value })}
            style={translationStyle}
            suppressHydrationWarning
          />
        </div>
        <div suppressHydrationWarning>
          <SelectionBox
            label={t('arabic_font_face')}
            value={selectedArabicFont}
            onClick={onArabicFontPanelOpen}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default FontSettings;
