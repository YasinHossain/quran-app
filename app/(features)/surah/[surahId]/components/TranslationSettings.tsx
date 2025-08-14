'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TranslationIcon } from '@/app/shared/icons';
import { CollapsibleSection } from './CollapsibleSection';
import { useSettings } from '@/app/providers/SettingsContext';
import SelectionBox from '@/app/shared/SelectionBox';

interface TranslationSettingsProps {
  onTranslationPanelOpen: () => void;
  onWordLanguagePanelOpen: () => void;
  onTafsirPanelOpen?: () => void;
  selectedTranslationName: string;
  selectedTafsirName?: string;
  selectedWordLanguageName: string;
  showTafsirSetting?: boolean;
}

export const TranslationSettings = ({
  onTranslationPanelOpen,
  onWordLanguagePanelOpen,
  onTafsirPanelOpen,
  selectedTranslationName,
  selectedTafsirName,
  selectedWordLanguageName,
  showTafsirSetting = false,
}: TranslationSettingsProps) => {
  const { settings, setSettings } = useSettings();
  const { t } = useTranslation();
  const [isReadingOpen, setReadingOpen] = useState(true);

  return (
    <>
      <CollapsibleSection
        title={t('reading_setting')}
        icon={<TranslationIcon size={20} className="text-teal-700" />}
        isLast={true}
        isOpen={isReadingOpen}
        onToggle={() => setReadingOpen(!isReadingOpen)}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-[var(--foreground)]">{t('show_word_by_word')}</span>
            <button
              onClick={() => setSettings({ ...settings, showByWords: !settings.showByWords })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.showByWords ? 'bg-teal-600' : 'bg-gray-200'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.showByWords ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--foreground)]">{t('apply_tajweed')}</span>
            <button
              onClick={() => setSettings({ ...settings, tajweed: !settings.tajweed })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.tajweed ? 'bg-teal-600' : 'bg-gray-200'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.tajweed ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>

          <SelectionBox
            label={t('translations')}
            value={selectedTranslationName}
            onClick={onTranslationPanelOpen}
          />

          <SelectionBox
            label={t('word_by_word_language')}
            value={selectedWordLanguageName}
            onClick={onWordLanguagePanelOpen}
          />
        </div>
      </CollapsibleSection>
    </>
  );
};
