'use client';

import React from 'react';

import { ArabicFontPanel } from '../ArabicFontPanel';
import { TranslationPanel, TafsirPanel } from '../panels';
import { WordLanguagePanel } from '../WordLanguagePanel';
import { SettingsPanelsProps } from './types';

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
