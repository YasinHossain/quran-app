'use client';

import React from 'react';

import { SettingsSidebarContent } from '@/app/(features)/surah/components/settings/SettingsSidebarContent';

interface SurahWorkspaceSettingsProps {
  selectedTranslationName?: string;
  selectedWordLanguageName?: string;
  isTranslationPanelOpen: boolean;
  onTranslationPanelOpen: () => void;
  onTranslationPanelClose: () => void;
  isWordLanguagePanelOpen: boolean;
  onWordLanguagePanelOpen: () => void;
  onWordLanguagePanelClose: () => void;
}

export function SurahWorkspaceSettings({
  selectedTranslationName,
  selectedWordLanguageName,
  isTranslationPanelOpen,
  onTranslationPanelOpen,
  onTranslationPanelClose,
  isWordLanguagePanelOpen,
  onWordLanguagePanelOpen,
  onWordLanguagePanelClose,
}: SurahWorkspaceSettingsProps): React.JSX.Element {
  return (
    <SettingsSidebarContent
      selectedTranslationName={selectedTranslationName}
      selectedWordLanguageName={selectedWordLanguageName}
      onTranslationPanelOpen={onTranslationPanelOpen}
      onWordLanguagePanelOpen={onWordLanguagePanelOpen}
      isTranslationPanelOpen={isTranslationPanelOpen}
      onTranslationPanelClose={onTranslationPanelClose}
      isWordLanguagePanelOpen={isWordLanguagePanelOpen}
      onWordLanguagePanelClose={onWordLanguagePanelClose}
    />
  );
}
