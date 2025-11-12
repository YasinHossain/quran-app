'use client';

import React from 'react';

import { SettingsSidebarContent } from '@/app/(features)/surah/components/settings/SettingsSidebarContent';

interface TafsirWorkspaceSettingsProps {
  selectedTranslationName: string;
  selectedTafsirName: string;
  selectedWordLanguageName: string;
  isTranslationPanelOpen: boolean;
  onTranslationPanelOpen: () => void;
  onTranslationPanelClose: () => void;
  isTafsirPanelOpen: boolean;
  onTafsirPanelOpen: () => void;
  onTafsirPanelClose: () => void;
  isWordLanguagePanelOpen: boolean;
  onWordLanguagePanelOpen: () => void;
  onWordLanguagePanelClose: () => void;
}

export function TafsirWorkspaceSettings({
  selectedTranslationName,
  selectedTafsirName,
  selectedWordLanguageName,
  isTranslationPanelOpen,
  onTranslationPanelOpen,
  onTranslationPanelClose,
  isTafsirPanelOpen,
  onTafsirPanelOpen,
  onTafsirPanelClose,
  isWordLanguagePanelOpen,
  onWordLanguagePanelOpen,
  onWordLanguagePanelClose,
}: TafsirWorkspaceSettingsProps): React.JSX.Element {
  return (
    <SettingsSidebarContent
      selectedTranslationName={selectedTranslationName}
      selectedTafsirName={selectedTafsirName}
      selectedWordLanguageName={selectedWordLanguageName}
      showTafsirSetting
      onTranslationPanelOpen={onTranslationPanelOpen}
      onWordLanguagePanelOpen={onWordLanguagePanelOpen}
      onTafsirPanelOpen={onTafsirPanelOpen}
      isTranslationPanelOpen={isTranslationPanelOpen}
      onTranslationPanelClose={onTranslationPanelClose}
      isTafsirPanelOpen={isTafsirPanelOpen}
      onTafsirPanelClose={onTafsirPanelClose}
      isWordLanguagePanelOpen={isWordLanguagePanelOpen}
      onWordLanguagePanelClose={onWordLanguagePanelClose}
    />
  );
}
