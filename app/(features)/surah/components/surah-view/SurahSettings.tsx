'use client';

import React from 'react';

import { SettingsSidebar } from '@/app/(features)/surah/components/settings/SettingsSidebar';

interface SurahSettingsProps {
  selectedTranslationName?: string;
  selectedWordLanguageName?: string;
  isTranslationPanelOpen: boolean;
  onTranslationPanelOpen: () => void;
  onTranslationPanelClose: () => void;
  isWordLanguagePanelOpen: boolean;
  onWordLanguagePanelOpen: () => void;
  onWordLanguagePanelClose: () => void;
}

export function SurahSettings({
  selectedTranslationName,
  selectedWordLanguageName,
  isTranslationPanelOpen,
  onTranslationPanelOpen,
  onTranslationPanelClose,
  isWordLanguagePanelOpen,
  onWordLanguagePanelOpen,
  onWordLanguagePanelClose,
}: SurahSettingsProps): React.JSX.Element {
  return (
    <SettingsSidebar
      onTranslationPanelOpen={onTranslationPanelOpen}
      onWordLanguagePanelOpen={onWordLanguagePanelOpen}
      onReadingPanelOpen={() => {}}
      selectedTranslationName={selectedTranslationName}
      selectedWordLanguageName={selectedWordLanguageName}
      isTranslationPanelOpen={isTranslationPanelOpen}
      onTranslationPanelClose={onTranslationPanelClose}
      isWordLanguagePanelOpen={isWordLanguagePanelOpen}
      onWordLanguagePanelClose={onWordLanguagePanelClose}
      pageType="verse"
    />
  );
}
