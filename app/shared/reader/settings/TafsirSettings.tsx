'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { CollapsibleSection } from '@/app/(features)/surah/components/CollapsibleSection';
import { useSettings } from '@/app/providers/SettingsContext';
import { BookReaderIcon } from '@/app/shared/icons';
import { SelectionBox } from '@/app/shared/SelectionBox';

import { FontSizeSlider } from './font-settings/FontSizeSlider';

interface TafsirSettingsProps {
  onTafsirPanelOpen?: () => void;
  selectedTafsirName?: string;
  showTafsirSetting?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  idPrefix?: string;
}

export const TafsirSettings = ({
  onTafsirPanelOpen,
  selectedTafsirName,
  showTafsirSetting = false,
  isOpen = false,
  onToggle,
  idPrefix,
}: TafsirSettingsProps): React.JSX.Element => {
  const { settings, setTafsirFontSize } = useSettings();
  const { t } = useTranslation();

  return (
    <>
      {showTafsirSetting && (
        <CollapsibleSection
          title={t('tafsir_setting')}
          icon={<BookReaderIcon size={20} className="text-accent" />}
          isLast={true}
          isOpen={isOpen}
          onToggle={onToggle || (() => {})}
        >
          <div className="space-y-4">
            <SelectionBox
              {...(idPrefix ? { id: `${idPrefix}-tafsir-select` } : {})}
              label={t('select_tafsir')}
              value={selectedTafsirName || ''}
              onClick={() => onTafsirPanelOpen?.()}
            />
            <FontSizeSlider
              label={t('tafsir_font_size')}
              value={settings.tafsirFontSize || 18}
              min={12}
              max={48}
              onChange={setTafsirFontSize}
              style={{}} // Style is handled internally
            />
          </div>
        </CollapsibleSection>
      )}
    </>
  );
};
