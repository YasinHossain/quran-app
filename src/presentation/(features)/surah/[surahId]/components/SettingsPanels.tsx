'use client';

import React from 'react';
import { ArabicFontPanel } from './ArabicFontPanel';
import { TranslationPanel } from './translation-panel';
import { TafsirPanel } from './tafsir-panel';
import { WordLanguagePanel } from './WordLanguagePanel';
import { SettingsSidebarProps } from './SettingsSidebar';

interface SettingsPanelsProps
  extends Pick<
    SettingsSidebarProps,
    | 'isTranslationPanelOpen'
    | 'onTranslationPanelClose'
    | 'isTafsirPanelOpen'
    | 'onTafsirPanelClose'
    | 'isWordLanguagePanelOpen'
    | 'onWordLanguagePanelClose'
  > {
  isArabicFontPanelOpen: boolean;
  onArabicFontPanelClose: () => void;
}

export const SettingsPanels = ({
  isArabicFontPanelOpen,
  onArabicFontPanelClose,
  isTranslationPanelOpen,
  onTranslationPanelClose,
  isTafsirPanelOpen,
  onTafsirPanelClose,
  isWordLanguagePanelOpen,
  onWordLanguagePanelClose,
}: SettingsPanelsProps) => {
  return (
    <>
      <ArabicFontPanel isOpen={isArabicFontPanelOpen} onClose={onArabicFontPanelClose} />
      {onTranslationPanelClose && (
        <TranslationPanel isOpen={!!isTranslationPanelOpen} onClose={onTranslationPanelClose} />
      )}
      {onTafsirPanelClose && (
        <TafsirPanel isOpen={!!isTafsirPanelOpen} onClose={onTafsirPanelClose} />
      )}
      {onWordLanguagePanelClose && (
        <WordLanguagePanel isOpen={!!isWordLanguagePanelOpen} onClose={onWordLanguagePanelClose} />
      )}
    </>
  );
};
