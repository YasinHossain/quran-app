'use client';

import React from 'react';

import { SurahAudio } from './surah-view/SurahAudio';
import { SurahMain } from './surah-view/SurahMain';
import { SurahSettings } from './surah-view/SurahSettings';
import { useBodyOverflowHidden } from './surah-view/useBodyOverflowHidden';
import { useSurahView } from './surah-view/useSurahView';

interface SurahViewProps {
  surahId: string;
}

/**
 * Main client component for displaying Surah verses with settings sidebar.
 * Manages verse listing, audio playback, and responsive layout with hidden header behavior.
 */
export function SurahView({ surahId }: SurahViewProps): React.JSX.Element {
  useBodyOverflowHidden();
  const { verseListing, panels } = useSurahView(surahId);

  return (
    <>
      <SurahMain
        verses={verseListing.verses}
        isLoading={verseListing.isLoading}
        error={verseListing.error}
        loadMoreRef={verseListing.loadMoreRef}
        isValidating={verseListing.isValidating}
        isReachingEnd={verseListing.isReachingEnd}
      />

      <SurahSettings
        selectedTranslationName={panels.selectedTranslationName}
        selectedWordLanguageName={panels.selectedWordLanguageName}
        isTranslationPanelOpen={panels.isTranslationPanelOpen}
        onTranslationPanelOpen={panels.openTranslationPanel}
        onTranslationPanelClose={panels.closeTranslationPanel}
        isWordLanguagePanelOpen={panels.isWordLanguagePanelOpen}
        onWordLanguagePanelOpen={panels.openWordLanguagePanel}
        onWordLanguagePanelClose={panels.closeWordLanguagePanel}
      />

      <SurahAudio
        activeVerse={verseListing.activeVerse}
        reciter={verseListing.reciter}
        isVisible={verseListing.isPlayerVisible}
        onNext={verseListing.handleNext}
        onPrev={verseListing.handlePrev}
      />
    </>
  );
}
