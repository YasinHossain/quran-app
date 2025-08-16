'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookReaderIcon } from '@/app/shared/icons';
import { CollapsibleSection } from './CollapsibleSection';
import { useSettings } from '@/app/providers/SettingsContext';
import { useFontSize } from '../../hooks/useFontSize';
import SelectionBox from '@/app/shared/SelectionBox';

interface TafsirSettingsProps {
  onTafsirPanelOpen?: () => void;
  selectedTafsirName?: string;
  showTafsirSetting?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const TafsirSettings = ({
  onTafsirPanelOpen,
  selectedTafsirName,
  showTafsirSetting = false,
  isOpen = false,
  onToggle,
}: TafsirSettingsProps) => {
  const { settings, setSettings } = useSettings();
  const { t } = useTranslation();
  const { style: tafsirStyle } = useFontSize(settings.tafsirFontSize, 12, 28);

  return (
    <>
      {showTafsirSetting && (
        <CollapsibleSection
          title={t('tafsir_setting')}
          icon={<BookReaderIcon size={20} className="text-teal-700" />}
          isLast={true}
          isOpen={isOpen}
          onToggle={onToggle || (() => {})}
        >
          <div className="space-y-4">
            <SelectionBox
              label={t('select_tafsir')}
              value={selectedTafsirName || ''}
              onClick={() => onTafsirPanelOpen?.()}
            />
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <label className="text-[var(--foreground)]">{t('tafsir_font_size')}</label>
                <span className="font-semibold text-teal-700">{settings.tafsirFontSize}</span>
              </div>
              <input
                type="range"
                min="12"
                max="28"
                value={settings.tafsirFontSize}
                onChange={(e) => setSettings({ ...settings, tafsirFontSize: +e.target.value })}
                style={tafsirStyle}
              />
            </div>
          </div>
        </CollapsibleSection>
      )}
    </>
  );
};
