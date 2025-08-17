'use client';

import React from 'react';
import { SettingsSidebar } from './components/SettingsSidebar';
import { getVersesByChapter } from '@/lib/api';
import useVerseListing from '@/app/(features)/surah/hooks/useVerseListing';
import useSurahPanels from '@/app/(features)/surah/hooks/useSurahPanels';
import SurahAudioPlayer from './components/SurahAudioPlayer';
import SurahVerseList from './components/SurahVerseList';

interface SurahPageProps {
  params: Promise<{ surahId: string }>;
}

export default function SurahPage({ params }: SurahPageProps) {
  const { surahId } = React.use(params);

  const {
    error,
    isLoading,
    verses,
    isValidating,
    isReachingEnd,
    loadMoreRef,
    translationOptions,
    wordLanguageOptions,
    settings,
    activeVerse,
    reciter,
    isPlayerVisible,
    handleNext,
    handlePrev,
  } = useVerseListing({ id: surahId, lookup: getVersesByChapter });

  const {
    isTranslationPanelOpen,
    openTranslationPanel,
    closeTranslationPanel,
    isWordLanguagePanelOpen,
    openWordLanguagePanel,
    closeWordLanguagePanel,
    selectedTranslationName,
    selectedWordLanguageName,
  } = useSurahPanels({ translationOptions, wordLanguageOptions, settings });

  return (
    <div className="flex flex-grow bg-background text-foreground font-sans overflow-hidden">
      <main className="flex-grow bg-background p-6 lg:p-10 overflow-y-auto homepage-scrollable-area">
        <SurahVerseList
          verses={verses}
          isLoading={isLoading}
          error={error}
          loadMoreRef={loadMoreRef}
          isValidating={isValidating}
          isReachingEnd={isReachingEnd}
        />
      </main>
      <SettingsSidebar
        onTranslationPanelOpen={openTranslationPanel}
        onWordLanguagePanelOpen={openWordLanguagePanel}
        onReadingPanelOpen={() => {}}
        selectedTranslationName={selectedTranslationName}
        selectedWordLanguageName={selectedWordLanguageName}
        isTranslationPanelOpen={isTranslationPanelOpen}
        onTranslationPanelClose={closeTranslationPanel}
        isWordLanguagePanelOpen={isWordLanguagePanelOpen}
        onWordLanguagePanelClose={closeWordLanguagePanel}
        pageType="verse"
      />
      <SurahAudioPlayer
        activeVerse={activeVerse}
        reciter={reciter}
        isVisible={isPlayerVisible}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
