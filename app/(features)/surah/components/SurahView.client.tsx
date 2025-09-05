'use client';

import React from 'react';

import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { getVersesByChapter } from '@/lib/api';

import { useVerseListing, useSurahPanels } from '../hooks';
import { SettingsSidebar } from './settings/SettingsSidebar';
import { SurahAudioPlayer } from './SurahAudioPlayer';
import { SurahVerseList } from './SurahVerseList';

interface SurahViewProps {
  surahId: string;
}

/**
 * Main client component for displaying Surah verses with settings sidebar.
 * Manages verse listing, audio playback, and responsive layout with hidden header behavior.
 */
export function SurahView({ surahId }: SurahViewProps) {
  const { isHidden } = useHeaderVisibility();

  React.useEffect(() => {
    // Set initial body overflow, but allow sidebar context to override
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      // Only restore if body overflow is still 'hidden' (not changed by sidebar)
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = originalOverflow;
      }
    };
  }, []);

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

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <main className="h-screen text-foreground font-sans lg:mr-[20.7rem] overflow-hidden">
        <div
          ref={scrollContainerRef}
          className={`h-full overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6 transition-all duration-300 ${
            isHidden
              ? 'pt-0'
              : 'pt-[calc(3.5rem+env(safe-area-inset-top))] sm:pt-[calc(4rem+env(safe-area-inset-top))]'
          }`}
        >
          <SurahVerseList
            verses={verses}
            isLoading={isLoading}
            error={error}
            loadMoreRef={loadMoreRef}
            isValidating={isValidating}
            isReachingEnd={isReachingEnd}
          />
        </div>
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
    </>
  );
}
