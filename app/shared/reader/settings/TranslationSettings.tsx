'use client';

import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { CollapsibleSection } from '@/app/(features)/surah/components/CollapsibleSection';
import { useSettings } from '@/app/providers/SettingsContext';
import { useTheme } from '@/app/providers/ThemeContext';
import { TranslationIcon } from '@/app/shared/icons';
import { SelectionBox } from '@/app/shared/SelectionBox';
import { DEFAULT_MUSHAF_ID, TAJWEED_MUSHAF_ID } from '@/data/mushaf/options';

interface TranslationSettingsProps {
  onTranslationPanelOpen: () => void;
  onWordLanguagePanelOpen: () => void;
  onTajweedRulesPanelOpen?: (() => void) | undefined;
  selectedTranslationName: string;
  selectedWordLanguageName: string;
  isOpen?: boolean;
  onToggle?: () => void;
  idPrefix?: string;
}

export const TranslationSettings = ({
  onTranslationPanelOpen,
  onWordLanguagePanelOpen,
  onTajweedRulesPanelOpen,
  selectedTranslationName,
  selectedWordLanguageName,
  isOpen = false,
  onToggle,
  idPrefix,
}: TranslationSettingsProps): React.JSX.Element => {
  const { settings, setSettings } = useSettings();
  const { t } = useTranslation();
  // Store the previous mushaf ID when switching to tajweed
  const previousMushafIdRef = useRef<string | undefined>(undefined);

  const toggleShowByWords = React.useCallback(() => {
    setSettings({ ...settings, showByWords: !settings.showByWords });
  }, [setSettings, settings]);

  const toggleTajweed = React.useCallback(() => {
    const newTajweedState = !settings.tajweed;

    if (newTajweedState) {
      // Enabling tajweed - store current mushaf and switch to tajweed mushaf
      previousMushafIdRef.current = settings.mushafId;
      setSettings({
        ...settings,
        tajweed: true,
        mushafId: TAJWEED_MUSHAF_ID,
      });
    } else {
      // Disabling tajweed - restore previous mushaf
      setSettings({
        ...settings,
        tajweed: false,
        mushafId: previousMushafIdRef.current || DEFAULT_MUSHAF_ID,
      });
      previousMushafIdRef.current = undefined;
    }
  }, [setSettings, settings]);

  return (
    <CollapsibleSection
      title={t('reading_setting')}
      icon={<TranslationIcon size={20} className="text-accent" />}
      isLast={true}
      isOpen={isOpen}
      onToggle={onToggle || (() => { })}
    >
      <ReadingSettingsContent
        t={t}
        settings={settings}
        toggleShowByWords={toggleShowByWords}
        toggleTajweed={toggleTajweed}
        selectedTranslationName={selectedTranslationName}
        selectedWordLanguageName={selectedWordLanguageName}
        onTranslationPanelOpen={onTranslationPanelOpen}
        onWordLanguagePanelOpen={onWordLanguagePanelOpen}
        onTajweedRulesPanelOpen={onTajweedRulesPanelOpen}
        {...(idPrefix ? { idPrefix } : {})}
      />
    </CollapsibleSection>
  );
};

function ToggleRow({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}): React.JSX.Element {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-foreground">{label}</span>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 outline-none ring-0 focus:ring-0 focus:ring-offset-0 focus:outline-none ${active
          ? 'bg-accent shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]'
          : 'bg-gray-200 dark:bg-gray-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]'
          }`}
        aria-pressed={active}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] ring-0 transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
      </button>
    </div>
  );
}

function ReadingSettingsContent({
  t,
  settings,
  toggleShowByWords,
  toggleTajweed,
  selectedTranslationName,
  selectedWordLanguageName,
  onTranslationPanelOpen,
  onWordLanguagePanelOpen,
  onTajweedRulesPanelOpen,
  idPrefix,
}: {
  t: (k: string) => string;
  settings: ReturnType<typeof useSettings>['settings'];
  toggleShowByWords: () => void;
  toggleTajweed: () => void;
  selectedTranslationName: string;
  selectedWordLanguageName: string;
  onTranslationPanelOpen: () => void;
  onWordLanguagePanelOpen: () => void;
  onTajweedRulesPanelOpen?: (() => void) | undefined;
  idPrefix?: string;
}): React.JSX.Element {
  const { theme, setTheme } = useTheme();

  const toggleTheme = React.useCallback((): void => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setTheme('light');
    } else {
      html.classList.add('dark');
      setTheme('dark');
    }
  }, [setTheme]);

  return (
    <div className="space-y-4">
      <ToggleRow
        label={t('night_mode') === 'night_mode' ? 'Night Mode' : t('night_mode')}
        active={theme === 'dark'}
        onToggle={toggleTheme}
      />

      <SelectionBox
        {...(idPrefix ? { id: `${idPrefix}-translations` } : {})}
        label={t('translations')}
        value={selectedTranslationName || 'No translation selected'}
        onClick={onTranslationPanelOpen}
      />

      <ToggleRow
        label={t('show_word_by_word')}
        active={settings.showByWords}
        onToggle={toggleShowByWords}
      />

      <SelectionBox
        {...(idPrefix ? { id: `${idPrefix}-wbw` } : {})}
        label={t('word_by_word_language')}
        value={selectedWordLanguageName}
        onClick={onWordLanguagePanelOpen}
      />

      <ToggleRow label={t('apply_tajweed')} active={settings.tajweed} onToggle={toggleTajweed} />

      {settings.tajweed && onTajweedRulesPanelOpen && (
        <SelectionBox
          {...(idPrefix ? { id: `${idPrefix}-tajweed-rules` } : {})}
          label={t('tajweed_colors') === 'tajweed_colors' ? 'Tajweed Colors' : t('tajweed_colors')}
          value={t('view_color_rules') === 'view_color_rules' ? 'View Color Rules' : t('view_color_rules')}
          onClick={onTajweedRulesPanelOpen}
        />
      )}
    </div>
  );
}
