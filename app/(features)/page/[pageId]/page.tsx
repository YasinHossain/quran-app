'use client';

import React, { useState } from 'react';

import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { SettingsSidebar } from '@/app/(features)/surah/components';

import { PageAudioPlayer } from './components/PageAudioPlayer';
import { PageContent } from './components/PageContent';
import { usePageData } from './hooks/usePageData';

interface UseSettingsSidebarReturn {
  isTranslationPanelOpen: boolean;
  isWordPanelOpen: boolean;
  openTranslationPanel: () => void;
  closeTranslationPanel: () => void;
  openWordPanel: () => void;
  closeWordPanel: () => void;
}

function useSettingsSidebar(): UseSettingsSidebarReturn {
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);

  return {
    isTranslationPanelOpen,
    isWordPanelOpen,
    openTranslationPanel: () => setIsTranslationPanelOpen(true),
    closeTranslationPanel: () => setIsTranslationPanelOpen(false),
    openWordPanel: () => setIsWordPanelOpen(true),
    closeWordPanel: () => setIsWordPanelOpen(false),
  };
}

interface PagePageProps {
  params: Promise<{ pageId: string }>;
}

/**
 * Main page component for viewing verses by Quran page number
 */
export default function PagePage({ params }: PagePageProps): JSX.Element {
  const { pageId } = React.use(params);
  const { isHidden } = useHeaderVisibility();
  const settingsSidebar = useSettingsSidebar();

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
        onTranslationPanelOpen={settingsSidebar.openTranslationPanel}
        onWordLanguagePanelOpen={settingsSidebar.openWordPanel}
        onReadingPanelOpen={() => {}}
        selectedTranslationName={selectedTranslationName}
        selectedWordLanguageName={selectedWordLanguageName}
        isTranslationPanelOpen={settingsSidebar.isTranslationPanelOpen}
        onTranslationPanelClose={settingsSidebar.closeTranslationPanel}
        isWordLanguagePanelOpen={settingsSidebar.isWordPanelOpen}
        onWordLanguagePanelClose={settingsSidebar.closeWordPanel}
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
