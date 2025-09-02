'use client';

import React, { useState } from 'react';
import { SettingsSidebar } from '@/app/(features)/surah/[surahId]/components/SettingsSidebar';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { PageContent } from './components/PageContent';
import { PageAudioPlayer } from './components/PageAudioPlayer';
import { usePageData } from './hooks/usePageData';

interface PagePageProps {
  params: Promise<{ pageId: string }>;
}

/**
 * Main page component for viewing verses by Quran page number
 */
export default function PagePage({ params }: PagePageProps) {
  const { pageId } = React.use(params);
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);
  const { isHidden } = useHeaderVisibility();

  const {
    error,
    isLoading,
    verses,
    isValidating,
    isReachingEnd,
    loadMoreRef,
    selectedTranslationName,
    selectedWordLanguageName,
    isPlayerVisible,
    handleNext,
    handlePrev,
    track,
  } = usePageData({ pageId });

  return (
    <div className="flex flex-grow bg-surface text-foreground font-sans overflow-hidden">
      <PageContent
        verses={verses}
        isLoading={isLoading}
        error={error}
        isValidating={isValidating}
        isReachingEnd={isReachingEnd}
        loadMoreRef={loadMoreRef}
        isHidden={isHidden}
      />
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
      <PageAudioPlayer
        track={track}
        isVisible={isPlayerVisible}
        isHidden={isHidden}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
