'use client';

import React from 'react';

import { ArabicFontPanel } from '@/app/(features)/surah/components/ArabicFontPanel';
import { TranslationPanel, TafsirPanel, MushafPanel } from '@/app/(features)/surah/components/panels';
import { WordLanguagePanel } from '@/app/(features)/surah/components/WordLanguagePanel';

import { SettingsPanelsProps } from './types';

import type { ReactElement } from 'react';

export const SettingsPanels = ({
  isArabicFontPanelOpen,
  onArabicFontPanelClose,
  isTranslationPanelOpen,
  onTranslationPanelClose,
  isTafsirPanelOpen,
  onTafsirPanelClose,
  isWordLanguagePanelOpen,
  onWordLanguagePanelClose,
  isMushafPanelOpen,
  onMushafPanelClose,
  mushafOptions,
  selectedMushafId,
  onMushafChange,
}: SettingsPanelsProps): ReactElement => {
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
      {onMushafPanelClose && mushafOptions && onMushafChange && (
        <MushafPanel
          isOpen={!!isMushafPanelOpen}
          onClose={onMushafPanelClose}
          options={mushafOptions}
          selectedId={selectedMushafId}
          onSelect={onMushafChange}
        />
      )}
    </>
  );
};
