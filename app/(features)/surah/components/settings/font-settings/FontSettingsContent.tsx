import React from 'react';
import type { CSSProperties, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { CollapsibleSection } from '@/app/(features)/surah/components/CollapsibleSection';
import { useSettings } from '@/app/providers/SettingsContext';
import { FontSettingIcon } from '@/app/shared/icons';

import { ArabicFontFaceSelector } from './ArabicFontFaceSelector';
import { FontSizeSlider } from './FontSizeSlider';

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
}: FontSettingsContentProps): ReactElement {
  const { t } = useTranslation();

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
        <FontSizeSlider
          label={t('translation_font_size')}
          value={settings.translationFontSize ?? 16}
          min={12}
          max={28}
          onChange={handleTranslationFontSizeChange}
          style={translationStyle}
        />
        <ArabicFontFaceSelector
          label={t('arabic_font_face')}
          value={selectedArabicFont}
          onClick={onArabicFontPanelOpen}
        />
      </div>
    </CollapsibleSection>
  );
}
