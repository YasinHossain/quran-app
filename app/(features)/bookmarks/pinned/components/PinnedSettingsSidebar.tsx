'use client';

import React from 'react';

import { SettingsSidebar as SurahSettingsSidebar } from '@/app/(features)/surah/components';

interface PinnedSettingsSidebarProps {
  onTranslationPanelOpen: () => void;
  onWordLanguagePanelOpen: () => void;
  onReadingPanelOpen?: () => void;
  selectedTranslationName?: string;
  selectedWordLanguageName?: string;
  isTranslationPanelOpen: boolean;
  onTranslationPanelClose: () => void;
  isWordPanelOpen: boolean;
  onWordPanelClose: () => void;
}

export const PinnedSettingsSidebar = ({
  onTranslationPanelOpen,
  onWordLanguagePanelOpen,
  onReadingPanelOpen,
  selectedTranslationName,
  selectedWordLanguageName,
  isTranslationPanelOpen,
  onTranslationPanelClose,
  isWordPanelOpen,
  onWordPanelClose,
}: PinnedSettingsSidebarProps): React.JSX.Element => (
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
