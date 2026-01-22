'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CollapsibleSection } from '@/app/(features)/surah/components/CollapsibleSection';
import { useFontSize } from '@/app/(features)/surah/hooks/useFontSize';
import { useSettings } from '@/app/providers/SettingsContext';
import { BookReaderIcon } from '@/app/shared/icons';
import { SelectionBox } from '@/app/shared/SelectionBox';

import { ArabicVersePreview } from './font-settings/ArabicVersePreview';
import { FontSizeSlider } from './font-settings/FontSizeSlider';

import type { ReactElement } from 'react';

interface MushafSettingsProps {
  selectedMushafName: string;
  onMushafPanelOpen: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
  idPrefix?: string;
}

export const MushafSettings = ({
  selectedMushafName,
  onMushafPanelOpen,
  isOpen = false,
  onToggle,
  idPrefix,
}: MushafSettingsProps): ReactElement => {
  const { settings, setArabicFontSize } = useSettings();
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const { style: arabicStyle } = useFontSize(settings.arabicFontSize, 16, 48);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleArabicFontSizeChange = useCallback(
    (value: number): void => {
      setArabicFontSize(value);
    },
    [setArabicFontSize]
  );

  return (
    <CollapsibleSection
      title={t('mushaf_settings')}
      icon={<BookReaderIcon size={20} className="text-accent" />}
      isLast
      isOpen={isOpen}
      onToggle={onToggle || (() => {})}
    >
      <div className="space-y-4">
        <SelectionBox
          {...(idPrefix ? { id: `${idPrefix}-mushaf-select` } : {})}
          label={t('mushaf')}
          value={selectedMushafName}
          onClick={onMushafPanelOpen}
        />
        {isClient && (
          <FontSizeSlider
            label={t('mushaf_font_size')}
            value={settings.arabicFontSize ?? 34}
            min={16}
            max={48}
            onChange={handleArabicFontSizeChange}
            style={arabicStyle}
          />
        )}
      </div>
      {/* Mobile preview */}
      <div className="lg:hidden">
        <ArabicVersePreview
          fontFamily={settings.arabicFontFace}
          fontSize={settings.arabicFontSize}
          className="mt-6 rounded-lg border border-border bg-surface p-4"
        />
      </div>
    </CollapsibleSection>
  );
};
