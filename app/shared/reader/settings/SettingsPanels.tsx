'use client';

import React from 'react';

import { ArabicFontPanel } from '@/app/(features)/surah/components/ArabicFontPanel';
import {
  TranslationPanel,
  TafsirPanel,
  MushafPanel,
  TajweedRulesPanel,
} from '@/app/(features)/surah/components/panels';
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
  isTajweedRulesPanelOpen,
  onTajweedRulesPanelClose,
  onCloseSidebar,
}: SettingsPanelsProps): ReactElement => {
  return (
    <>
      <ArabicFontPanel
        isOpen={isArabicFontPanelOpen}
        onClose={onArabicFontPanelClose}
        {...(onCloseSidebar ? { onCloseSidebar } : {})}
      />
      {onTranslationPanelClose && (
        <TranslationPanel
          isOpen={!!isTranslationPanelOpen}
          onClose={onTranslationPanelClose}
          {...(onCloseSidebar ? { onCloseSidebar } : {})}
        />
      )}
      {onTafsirPanelClose && (
        <TafsirPanel
          isOpen={!!isTafsirPanelOpen}
          onClose={onTafsirPanelClose}
          {...(onCloseSidebar ? { onCloseSidebar } : {})}
        />
      )}
      {onWordLanguagePanelClose && (
        <WordLanguagePanel
          isOpen={!!isWordLanguagePanelOpen}
          onClose={onWordLanguagePanelClose}
          {...(onCloseSidebar ? { onCloseSidebar } : {})}
        />
      )}
      {onMushafPanelClose && mushafOptions && onMushafChange && (
        <MushafPanel
          isOpen={!!isMushafPanelOpen}
          onClose={onMushafPanelClose}
          options={mushafOptions}
          selectedId={selectedMushafId}
          onSelect={onMushafChange}
          {...(onCloseSidebar ? { onCloseSidebar } : {})}
        />
      )}
      {onTajweedRulesPanelClose && (
        <TajweedRulesPanel
          isOpen={!!isTajweedRulesPanelOpen}
          onClose={onTajweedRulesPanelClose}
          {...(onCloseSidebar ? { onCloseSidebar } : {})}
        />
      )}
    </>
  );
};
