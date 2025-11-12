'use client';

import React from 'react';

import { SettingsSidebar } from './SettingsSidebar';

import type { PanelTogglesProps } from './BookmarkFolderViewParts.client';

export function SettingsSidebarMobile({
  onOpenTranslationPanel,
  onOpenWordPanel,
  onCloseTranslationPanel,
  onCloseWordPanel,
  isTranslationPanelOpen,
  isWordPanelOpen,
  selectedTranslationName,
  selectedWordLanguageName,
}: PanelTogglesProps): React.JSX.Element {
  return (
    <div className="lg:hidden">
      <SettingsSidebar
        onTranslationPanelOpen={onOpenTranslationPanel}
        onWordLanguagePanelOpen={onOpenWordPanel}
        onReadingPanelOpen={() => {}}
        selectedTranslationName={selectedTranslationName}
        selectedWordLanguageName={selectedWordLanguageName}
        isTranslationPanelOpen={isTranslationPanelOpen}
        onTranslationPanelClose={onCloseTranslationPanel}
        isWordPanelOpen={isWordPanelOpen}
        onWordPanelClose={onCloseWordPanel}
      />
    </div>
  );
}
