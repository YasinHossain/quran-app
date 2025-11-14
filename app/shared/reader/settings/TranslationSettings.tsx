'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { CollapsibleSection } from '@/app/(features)/surah/components/CollapsibleSection';
import { useSettings } from '@/app/providers/SettingsContext';
import { TranslationIcon } from '@/app/shared/icons';
import { SelectionBox } from '@/app/shared/SelectionBox';

interface TranslationSettingsProps {
  onTranslationPanelOpen: () => void;
  onWordLanguagePanelOpen: () => void;
  selectedTranslationName: string;
  selectedWordLanguageName: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const TranslationSettings = ({
  onTranslationPanelOpen,
  onWordLanguagePanelOpen,
  selectedTranslationName,
  selectedWordLanguageName,
  isOpen = false,
  onToggle,
}: TranslationSettingsProps): React.JSX.Element => {
  const { settings, setSettings } = useSettings();
  const { t } = useTranslation();

  const toggleShowByWords = React.useCallback(() => {
    setSettings({ ...settings, showByWords: !settings.showByWords });
  }, [setSettings, settings]);

  const toggleTajweed = React.useCallback(() => {
    setSettings({ ...settings, tajweed: !settings.tajweed });
  }, [setSettings, settings]);

  return (
    <CollapsibleSection
      title={t('reading_setting')}
      icon={<TranslationIcon size={20} className="text-accent" />}
      isLast={true}
      isOpen={isOpen}
      onToggle={onToggle || (() => {})}
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
    <div className="flex items-center justify-between pt-2">
      <span className="text-sm text-foreground">{label}</span>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full ${active ? 'bg-accent' : 'bg-muted'}`}
        aria-pressed={active}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-surface transition ${active ? 'translate-x-6' : 'translate-x-1'}`}
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
}: {
  t: (k: string) => string;
  settings: ReturnType<typeof useSettings>['settings'];
  toggleShowByWords: () => void;
  toggleTajweed: () => void;
  selectedTranslationName: string;
  selectedWordLanguageName: string;
  onTranslationPanelOpen: () => void;
  onWordLanguagePanelOpen: () => void;
}): React.JSX.Element {
  return (
    <div className="space-y-4">
      <ToggleRow
        label={t('show_word_by_word')}
        active={settings.showByWords}
        onToggle={toggleShowByWords}
      />
      <ToggleRow label={t('apply_tajweed')} active={settings.tajweed} onToggle={toggleTajweed} />

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
  );
}
