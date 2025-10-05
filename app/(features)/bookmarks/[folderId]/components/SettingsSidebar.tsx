'use client';

import React from 'react';

import { SettingsSidebar as SurahSettingsSidebar } from '@/app/(features)/surah/components';

interface SettingsSidebarProps {
  onTranslationPanelOpen: () => void;
  onWordLanguagePanelOpen: () => void;
  onReadingPanelOpen?: () => void;
  selectedTranslationName?: string | undefined;
  selectedWordLanguageName?: string | undefined;
  isTranslationPanelOpen: boolean;
  onTranslationPanelClose: () => void;
  isWordPanelOpen: boolean;
  onWordPanelClose: () => void;
}

export const SettingsSidebar = ({
  onTranslationPanelOpen,
  onWordLanguagePanelOpen,
  onReadingPanelOpen,
  selectedTranslationName,
  selectedWordLanguageName,
  isTranslationPanelOpen,
  onTranslationPanelClose,
  isWordPanelOpen,
  onWordPanelClose,
}: SettingsSidebarProps): React.JSX.Element => (
  <SurahSettingsSidebar
    onTranslationPanelOpen={onTranslationPanelOpen}
    onWordLanguagePanelOpen={onWordLanguagePanelOpen}
    {...(onReadingPanelOpen ? { onReadingPanelOpen } : {})}
    selectedTranslationName={selectedTranslationName ?? ''}
    selectedWordLanguageName={selectedWordLanguageName ?? ''}
    isTranslationPanelOpen={isTranslationPanelOpen}
    onTranslationPanelClose={onTranslationPanelClose}
    isWordLanguagePanelOpen={isWordPanelOpen}
    onWordLanguagePanelClose={onWordPanelClose}
  />
);
