'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen } from 'lucide-react';
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
  // All hooks must be called before any conditional logic
  const { settings, updateSettings } = useSettings();
  const { t } = useTranslation();
  const { style: tafsirStyle } = useFontSize(settings?.tafsirFontSize || 16, 12, 28);

  // Early return if settings are not loaded (after all hooks)
  if (!settings) {
    return (
      <>
        {showTafsirSetting && (
          <CollapsibleSection
            title={t('tafsir_setting')}
            icon={<BookOpen size={20} className="text-accent" />}
            isLast={true}
            isOpen={isOpen}
            onToggle={onToggle || (() => {})}
          >
            <div className="space-y-4">
              <div className="text-center py-4 text-muted">{t('loading_settings')}</div>
            </div>
          </CollapsibleSection>
        )}
      </>
    );
  }

  return (
    <>
      {showTafsirSetting && (
        <CollapsibleSection
          title={t('tafsir_setting')}
          icon={<BookOpen size={20} className="text-accent" />}
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
                <label className="text-foreground">{t('tafsir_font_size')}</label>
                <span className="font-semibold text-accent">{settings.tafsirFontSize}</span>
              </div>
              <input
                type="range"
                min="12"
                max="28"
                value={settings.tafsirFontSize}
                onChange={(e) => updateSettings({ tafsirFontSize: +e.target.value })}
                style={tafsirStyle}
              />
            </div>
          </div>
        </CollapsibleSection>
      )}
    </>
  );
};
