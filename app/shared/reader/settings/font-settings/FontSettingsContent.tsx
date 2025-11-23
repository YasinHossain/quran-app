import React from 'react';
import { useTranslation } from 'react-i18next';

import { CollapsibleSection } from '@/app/(features)/surah/components/CollapsibleSection';
import { useSettings } from '@/app/providers/SettingsContext';
import { FontSettingIcon } from '@/app/shared/icons';

import { ArabicFontFaceSelector } from './ArabicFontFaceSelector';
import { FontSizeSlider } from './FontSizeSlider';

import type { CSSProperties, ReactElement } from 'react';

interface FontSettingsContentProps {
  isOpen?: boolean;
  onToggle?: () => void;
  settings: ReturnType<typeof useSettings>['settings'];
  arabicStyle: CSSProperties;
  translationStyle: CSSProperties;
  selectedArabicFont: string;
  onArabicFontPanelOpen: () => void;
  handleArabicFontSizeChange: (value: number) => void;
  handleTranslationFontSizeChange: (value: number) => void;
  idPrefix?: string;
  isArabicOnly?: boolean;
}

export function FontSettingsContent({
  isOpen,
  onToggle,
  settings,
  arabicStyle,
  translationStyle,
  selectedArabicFont,
  onArabicFontPanelOpen,
  handleArabicFontSizeChange,
  handleTranslationFontSizeChange,
  idPrefix,
  isArabicOnly = false,
}: FontSettingsContentProps): ReactElement {
  const { t } = useTranslation();
  const showTranslationFont = !isArabicOnly;
  const showArabicFontFace = !isArabicOnly;

  return (
    <CollapsibleSection
      title={t('font_setting')}
      icon={<FontSettingIcon size={20} className="text-accent" />}
      isLast
      isOpen={isOpen ?? false}
      onToggle={onToggle ?? (() => {})}
    >
      <div className="space-y-4">
        <FontSizeSlider
          label={t('arabic_font_size')}
          value={settings.arabicFontSize ?? 28}
          min={16}
          max={48}
          onChange={handleArabicFontSizeChange}
          style={arabicStyle}
        />
        {showTranslationFont && (
          <FontSizeSlider
            label={t('translation_font_size')}
            value={settings.translationFontSize ?? 16}
            min={12}
            max={28}
            onChange={handleTranslationFontSizeChange}
            style={translationStyle}
          />
        )}
        {showArabicFontFace && (
          <ArabicFontFaceSelector
            {...(idPrefix ? { id: `${idPrefix}-font-select` } : {})}
            label={t('arabic_font_face')}
            value={selectedArabicFont}
            onClick={onArabicFontPanelOpen}
          />
        )}
      </div>
    </CollapsibleSection>
  );
}
