'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTranslation, FaBookReader, FaChevronDown } from '@/app/shared/SvgIcons';
import { CollapsibleSection } from './CollapsibleSection';
import { useSettings } from '@/app/providers/SettingsContext';
import { useFontSize } from '../../hooks/useFontSize';

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
  const [isTafsirOpen, setTafsirOpen] = useState(false);
  const { style: tafsirStyle } = useFontSize(settings.tafsirFontSize, 12, 28);

  return (
    <>
      <CollapsibleSection
        title={t('reading_setting')}
        icon={<FaTranslation size={20} className="text-teal-700" />}
        isLast={!showTafsirSetting}
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

          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--foreground)]">
              {t('translations')}
            </label>
            <button
              onClick={onTranslationPanelOpen}
              className="w-full flex justify-between items-center bg-[var(--background)] border border-gray-200 dark:border-gray-600 rounded-lg p-2.5 text-sm text-left hover:border-teal-500 transition-shadow shadow-sm hover:shadow-md"
            >
              <span className="truncate text-[var(--foreground)]">{selectedTranslationName}</span>
              <FaChevronDown className="text-gray-500" />
            </button>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--foreground)]">
              {t('word_by_word_language')}
            </label>
            <button
              onClick={onWordLanguagePanelOpen}
              className="w-full flex justify-between items-center bg-[var(--background)] border border-gray-200 dark:border-gray-600 rounded-lg p-2.5 text-sm text-left hover:border-teal-500 transition-shadow shadow-sm hover:shadow-md"
            >
              <span className="truncate text-[var(--foreground)]">{selectedWordLanguageName}</span>
              <FaChevronDown className="text-gray-500" />
            </button>
          </div>
        </div>
      </CollapsibleSection>
      {showTafsirSetting && (
        <CollapsibleSection
          title={t('tafsir_setting')}
          icon={<FaBookReader size={20} className="text-teal-700" />}
          isLast={false}
          isOpen={isTafsirOpen}
          onToggle={() => setTafsirOpen(!isTafsirOpen)}
        >
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-[var(--foreground)]">
                {t('select_tafsir')}
              </label>
              <button
                onClick={onTafsirPanelOpen}
                className="w-full flex justify-between items-center bg-[var(--background)] border border-gray-200 dark:border-gray-600 rounded-lg p-2.5 text-sm text-left hover:border-teal-500 transition-shadow shadow-sm hover:shadow-md"
              >
                <span className="truncate text-[var(--foreground)]">{selectedTafsirName}</span>
                <FaChevronDown className="text-gray-500" />
              </button>
            </div>
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
