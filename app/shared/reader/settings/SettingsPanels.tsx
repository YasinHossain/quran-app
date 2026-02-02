'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

import { ArabicFontPanel } from '@/app/(features)/surah/components/ArabicFontPanel';
import { WordLanguagePanel } from '@/app/(features)/surah/components/WordLanguagePanel';

import { SettingsPanelsProps } from './types';

import type { ReactElement } from 'react';

// Dynamic imports for heavy panels - only loaded when user opens them
const TranslationPanel = dynamic(
  () =>
    import('@/app/(features)/surah/components/panels/translation-panel').then(
      (mod) => mod.TranslationPanel
    ),
  { ssr: false }
);

const TafsirPanel = dynamic(
  () =>
    import('@/app/(features)/surah/components/panels/tafsir-panel').then((mod) => mod.TafsirPanel),
  { ssr: false }
);

const MushafPanel = dynamic(
  () =>
    import('@/app/(features)/surah/components/panels/mushaf-panel').then((mod) => mod.MushafPanel),
  { ssr: false }
);

const TajweedRulesPanel = dynamic(
  () =>
    import('@/app/(features)/surah/components/panels/tajweed-rules-panel').then(
      (mod) => mod.TajweedRulesPanel
    ),
  { ssr: false }
);

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
  const [hasOpenedTranslationPanel, setHasOpenedTranslationPanel] = useState(false);
  const [hasOpenedTafsirPanel, setHasOpenedTafsirPanel] = useState(false);
  const [hasOpenedMushafPanel, setHasOpenedMushafPanel] = useState(false);
  const [hasOpenedTajweedRulesPanel, setHasOpenedTajweedRulesPanel] = useState(false);

  const isTranslationOpen = Boolean(isTranslationPanelOpen);
  const isTafsirOpen = Boolean(isTafsirPanelOpen);
  const isMushafOpen = Boolean(isMushafPanelOpen);
  const isTajweedRulesOpen = Boolean(isTajweedRulesPanelOpen);

  useEffect(() => {
    if (isTranslationOpen) setHasOpenedTranslationPanel(true);
  }, [isTranslationOpen]);

  useEffect(() => {
    if (isTafsirOpen) setHasOpenedTafsirPanel(true);
  }, [isTafsirOpen]);

  useEffect(() => {
    if (isMushafOpen) setHasOpenedMushafPanel(true);
  }, [isMushafOpen]);

  useEffect(() => {
    if (isTajweedRulesOpen) setHasOpenedTajweedRulesPanel(true);
  }, [isTajweedRulesOpen]);

  return (
    <>
      <ArabicFontPanel
        isOpen={isArabicFontPanelOpen}
        onClose={onArabicFontPanelClose}
        {...(onCloseSidebar ? { onCloseSidebar } : {})}
      />
      {onTranslationPanelClose && (hasOpenedTranslationPanel || isTranslationOpen) ? (
        <TranslationPanel
          isOpen={isTranslationOpen}
          onClose={onTranslationPanelClose}
          {...(onCloseSidebar ? { onCloseSidebar } : {})}
        />
      ) : null}
      {onTafsirPanelClose && (hasOpenedTafsirPanel || isTafsirOpen) ? (
        <TafsirPanel
          isOpen={isTafsirOpen}
          onClose={onTafsirPanelClose}
          {...(onCloseSidebar ? { onCloseSidebar } : {})}
        />
      ) : null}
      {onWordLanguagePanelClose && (
        <WordLanguagePanel
          isOpen={!!isWordLanguagePanelOpen}
          onClose={onWordLanguagePanelClose}
          {...(onCloseSidebar ? { onCloseSidebar } : {})}
        />
      )}
      {onMushafPanelClose &&
      mushafOptions &&
      onMushafChange &&
      (hasOpenedMushafPanel || isMushafOpen) ? (
        <MushafPanel
          isOpen={isMushafOpen}
          onClose={onMushafPanelClose}
          options={mushafOptions}
          selectedId={selectedMushafId}
          onSelect={onMushafChange}
          {...(onCloseSidebar ? { onCloseSidebar } : {})}
        />
      ) : null}
      {onTajweedRulesPanelClose && (hasOpenedTajweedRulesPanel || isTajweedRulesOpen) ? (
        <TajweedRulesPanel
          isOpen={isTajweedRulesOpen}
          onClose={onTajweedRulesPanelClose}
          {...(onCloseSidebar ? { onCloseSidebar } : {})}
        />
      ) : null}
    </>
  );
};
