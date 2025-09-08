import React from 'react';

import { SettingsSidebar } from '@/app/(features)/surah/components';

export function JuzSettings({
  isTranslationPanelOpen,
  setIsTranslationPanelOpen,
  isWordPanelOpen,
  setIsWordPanelOpen,
  selectedTranslationName,
  selectedWordLanguageName,
}: {
  isTranslationPanelOpen: boolean;
  setIsTranslationPanelOpen: (v: boolean) => void;
  isWordPanelOpen: boolean;
  setIsWordPanelOpen: (v: boolean) => void;
  selectedTranslationName: string;
  selectedWordLanguageName: string;
}): JSX.Element {
  return (
    <SettingsSidebar
      onTranslationPanelOpen={() => setIsTranslationPanelOpen(true)}
      onWordLanguagePanelOpen={() => setIsWordPanelOpen(true)}
      onReadingPanelOpen={() => {}}
      selectedTranslationName={selectedTranslationName}
      selectedWordLanguageName={selectedWordLanguageName}
      isTranslationPanelOpen={isTranslationPanelOpen}
      onTranslationPanelClose={() => setIsTranslationPanelOpen(false)}
      isWordLanguagePanelOpen={isWordPanelOpen}
      onWordLanguagePanelClose={() => setIsWordPanelOpen(false)}
    />
  );
}
