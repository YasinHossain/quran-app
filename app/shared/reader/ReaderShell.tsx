'use client';

import React, { useCallback, useEffect } from 'react';

import { MushafMain } from '@/app/(features)/surah/components/surah-view/MushafMain';
import { SurahMain } from '@/app/(features)/surah/components/surah-view/SurahMain';
import { SurahWorkspaceNavigation } from '@/app/(features)/surah/components/surah-view/SurahWorkspaceNavigation';
import { useBodyOverflowHidden } from '@/app/(features)/surah/components/surah-view/useBodyOverflowHidden';
import { SurahListSidebar } from '@/app/shared/SurahListSidebar';
import { SettingsSidebar } from '@/app/shared/reader/settings';
import { SettingsSidebarContent } from '@/app/shared/reader/settings/SettingsSidebarContent';
import { useReaderMode } from '@/app/providers/ReaderModeContext';

import { ReaderAudioProps, WorkspaceReaderLayout } from './ReaderLayouts';
import { useReaderView } from './useReaderView';

import type { LookupFn, UseVerseListingParams } from '@/app/(features)/surah/hooks/useVerseListing';

type ReaderViewState = ReturnType<typeof useReaderView>;
type VerseListingState = ReaderViewState['verseListing'];
type ReaderPanelsState = ReaderViewState['panels'];

interface CreateSurahMainParams {
  verseListing: VerseListingState;
  emptyLabelKey?: string | undefined;
  endLabelKey?: string | undefined;
  initialVerseKey?: string | undefined;
  initialScrollNonce?: string | undefined;
}

const createSurahMain = ({
  verseListing,
  emptyLabelKey,
  endLabelKey,
  initialVerseKey,
  initialScrollNonce,
}: CreateSurahMainParams): React.ReactNode => (
  <SurahMain
    // Force remount not only when the target verse changes, but also when a new navigation
    // intent is fired for the same verse (via nav sequence query param)
    key={`${initialVerseKey ?? 'no-initial-verse'}:${initialScrollNonce ?? '0'}`}
    verses={verseListing.verses}
    isLoading={verseListing.isLoading}
    error={verseListing.error}
    loadMoreRef={verseListing.loadMoreRef}
    isValidating={verseListing.isValidating}
    isReachingEnd={verseListing.isReachingEnd}
    {...(emptyLabelKey ? { emptyLabelKey } : {})}
    {...(endLabelKey ? { endLabelKey } : {})}
    {...(initialVerseKey ? { initialVerseKey } : {})}
  />
);

const createSettingsSidebar = (
  panels: ReaderPanelsState,
  onReadingPanelOpen: () => void,
  onTranslationTabOpen: () => void,
  activeReaderMode: 'translation' | 'reading'
): React.ReactNode => (
  <SettingsSidebar
    pageType="verse"
    readerTabsEnabled
    selectedTranslationName={panels.selectedTranslationName}
    selectedWordLanguageName={panels.selectedWordLanguageName}
    selectedMushafName={panels.selectedMushafName}
    selectedMushafId={panels.selectedMushafId}
    onTranslationPanelOpen={panels.openTranslationPanel}
    onTranslationPanelClose={panels.closeTranslationPanel}
    isTranslationPanelOpen={panels.isTranslationPanelOpen}
    onWordLanguagePanelOpen={panels.openWordLanguagePanel}
    onWordLanguagePanelClose={panels.closeWordLanguagePanel}
    isWordLanguagePanelOpen={panels.isWordLanguagePanelOpen}
    onReadingPanelOpen={onReadingPanelOpen}
    onTranslationTabOpen={onTranslationTabOpen}
    isMushafPanelOpen={panels.isMushafPanelOpen}
    onMushafPanelOpen={panels.openMushafPanel}
    onMushafPanelClose={panels.closeMushafPanel}
    onMushafChange={panels.onMushafChange}
    mushafOptions={panels.mushafOptions}
    activeReaderMode={activeReaderMode}
  />
);

const createWorkspaceSettingsPanel = (
  panels: ReaderPanelsState,
  onReadingPanelOpen: () => void,
  onTranslationTabOpen: () => void,
  activeReaderMode: 'translation' | 'reading'
): React.ReactNode => (
  <SettingsSidebarContent
    readerTabsEnabled
    selectedTranslationName={panels.selectedTranslationName}
    selectedWordLanguageName={panels.selectedWordLanguageName}
    selectedMushafName={panels.selectedMushafName}
    selectedMushafId={panels.selectedMushafId}
    onTranslationPanelOpen={panels.openTranslationPanel}
    onTranslationPanelClose={panels.closeTranslationPanel}
    isTranslationPanelOpen={panels.isTranslationPanelOpen}
    onWordLanguagePanelOpen={panels.openWordLanguagePanel}
    onWordLanguagePanelClose={panels.closeWordLanguagePanel}
    isWordLanguagePanelOpen={panels.isWordLanguagePanelOpen}
    onReadingPanelOpen={onReadingPanelOpen}
    onTranslationTabOpen={onTranslationTabOpen}
    isMushafPanelOpen={panels.isMushafPanelOpen}
    onMushafPanelOpen={panels.openMushafPanel}
    onMushafPanelClose={panels.closeMushafPanel}
    onMushafChange={panels.onMushafChange}
    mushafOptions={panels.mushafOptions}
    activeReaderMode={activeReaderMode}
  />
);

const mapToAudioProps = (verseListing: VerseListingState): ReaderAudioProps => ({
  activeVerse: verseListing.activeVerse,
  reciter: verseListing.reciter,
  isVisible: verseListing.isPlayerVisible,
  onNext: verseListing.handleNext,
  onPrev: verseListing.handlePrev,
});

interface ReaderShellProps extends Pick<UseVerseListingParams, 'initialVerses'> {
  resourceId: string;
  lookup: LookupFn;
  emptyLabelKey?: string;
  endLabelKey?: string;
  initialVerseNumber?: number | undefined;
  initialVerseKey?: string | undefined;
  initialScrollNonce?: string | undefined;
}

export function ReaderShell({
  resourceId,
  lookup,
  initialVerses,
  emptyLabelKey,
  endLabelKey,
  initialVerseNumber,
  initialVerseKey,
  initialScrollNonce,
}: ReaderShellProps): React.JSX.Element {
  useBodyOverflowHidden();
  const { mode, setMode, enableReaderMode, disableReaderMode } = useReaderMode();
  const readerView = useReaderView({
    resourceId,
    lookup,
    initialVerses,
    ...(typeof initialVerseNumber === 'number' ? { initialVerseNumber } : {}),
  });
  const { verseListing, panels } = readerView;

  useEffect(() => {
    enableReaderMode('verse');
    return () => {
      disableReaderMode();
    };
  }, [enableReaderMode, disableReaderMode]);

  const handleReadingPanelOpen = useCallback(() => {
    setMode('mushaf');
  }, [setMode]);

  const handleTranslationTabOpen = useCallback(() => {
    setMode('verse');
  }, [setMode]);

  const surahMain = createSurahMain({
    verseListing,
    ...(typeof emptyLabelKey === 'string' ? { emptyLabelKey } : {}),
    ...(typeof endLabelKey === 'string' ? { endLabelKey } : {}),
    ...(typeof initialVerseKey === 'string' ? { initialVerseKey } : {}),
    ...(typeof initialScrollNonce === 'string' ? { initialScrollNonce } : {}),
  });
  const mushafMain = (
    <MushafMain
      mushafName={panels.selectedMushafName ?? 'Mushaf view'}
      verses={verseListing.verses}
      isLoading={verseListing.isLoading}
      error={verseListing.error}
      loadMoreRef={verseListing.loadMoreRef}
      isValidating={verseListing.isValidating}
      isReachingEnd={verseListing.isReachingEnd}
    />
  );
  const mainContent = mode === 'mushaf' ? mushafMain : surahMain;
  const activeReaderTab = mode === 'mushaf' ? 'reading' : 'translation';
  const settingsSidebar = createSettingsSidebar(
    panels,
    handleReadingPanelOpen,
    handleTranslationTabOpen,
    activeReaderTab
  );
  const workspaceSettingsSidebar = createWorkspaceSettingsPanel(
    panels,
    handleReadingPanelOpen,
    handleTranslationTabOpen,
    activeReaderTab
  );
  const audioProps = mapToAudioProps(verseListing);

  return (
    <WorkspaceReaderLayout
      main={mainContent}
      desktopLeft={<SurahWorkspaceNavigation />}
      desktopRight={workspaceSettingsSidebar}
      mobileLeft={<SurahListSidebar />}
      mobileRight={settingsSidebar}
      audio={audioProps}
    />
  );
}
