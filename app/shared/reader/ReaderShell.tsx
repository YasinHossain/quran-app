'use client';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { MushafMain } from '@/app/(features)/surah/components/surah-view/MushafMain';
import { SurahMain } from '@/app/(features)/surah/components/surah-view/SurahMain';
import { SurahWorkspaceNavigation } from '@/app/(features)/surah/components/surah-view/SurahWorkspaceNavigation';
import { useBodyOverflowHidden } from '@/app/(features)/surah/components/surah-view/useBodyOverflowHidden';
import { useReaderMode } from '@/app/providers/ReaderModeContext';
import { SettingsSidebar } from '@/app/shared/reader/settings';
import { SettingsSidebarContent } from '@/app/shared/reader/settings/SettingsSidebarContent';
import { SurahListSidebar } from '@/app/shared/SurahListSidebar';

import { ReaderAudioProps, WorkspaceReaderLayout } from './ReaderLayouts';
import { useReaderView } from './useReaderView';

import type { MushafResourceKind } from '@/app/(features)/surah/hooks/useMushafReadingView';
import type { LookupFn, UseVerseListingParams } from '@/app/(features)/surah/hooks/useVerseListing';

type ReaderViewState = ReturnType<typeof useReaderView>;
type VerseListingState = ReaderViewState['verseListing'];
type ReaderPanelsState = ReaderViewState['panels'];

interface CreateSurahMainParams {
  surahId?: number | undefined;
  verseListing: VerseListingState;
  emptyLabelKey?: string | undefined;
  endLabelKey?: string | undefined;
  initialVerseKey?: string | undefined;
  initialScrollNonce?: string | undefined;
  chapterId?: number | undefined;
}

const createSurahMain = ({
  surahId,
  verseListing,
  emptyLabelKey,
  endLabelKey,
  initialVerseKey,
  initialScrollNonce,
  chapterId,
}: CreateSurahMainParams): React.ReactNode => (
  <SurahMain
    // Force remount not only when the target verse changes, but also when a new navigation
    // intent is fired for the same verse (via nav sequence query param)
    key={`${initialVerseKey ?? 'no-initial-verse'}:${initialScrollNonce ?? '0'}`}
    surahId={surahId}
    verses={verseListing.verses}
    isLoading={verseListing.isLoading}
    error={verseListing.error}
    loadMoreRef={verseListing.loadMoreRef}
    isValidating={verseListing.isValidating}
    isReachingEnd={verseListing.isReachingEnd}
    {...(emptyLabelKey ? { emptyLabelKey } : {})}
    {...(endLabelKey ? { endLabelKey } : {})}
    {...(initialVerseKey ? { initialVerseKey } : {})}
    {...(typeof chapterId === 'number' ? { chapterId } : {})}
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
    idPrefix="desktop-settings"
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
  resourceKind?: MushafResourceKind;
  lookup: LookupFn;
  emptyLabelKey?: string;
  endLabelKey?: string;
  initialVerseNumber?: number | undefined;
  initialVerseKey?: string | undefined;
  initialScrollNonce?: string | undefined;
  initialMode?: 'verse' | 'mushaf';
}

export function ReaderShell({
  resourceId,
  resourceKind = 'surah',
  lookup,
  initialVerses,
  emptyLabelKey,
  endLabelKey,
  initialVerseNumber,
  initialVerseKey,
  initialScrollNonce,
  initialMode = 'verse',
}: ReaderShellProps): React.JSX.Element {
  useBodyOverflowHidden();
  const { mode, setMode, enableReaderMode, isReaderModeAvailable } = useReaderMode();
  const readerView = useReaderView({
    resourceId,
    resourceKind,
    lookup,
    initialVerses,
    ...(typeof initialVerseNumber === 'number' ? { initialVerseNumber } : {}),
  });
  const { verseListing, panels, mushafView } = readerView;
  const initialModeRef = useRef(initialMode);

  useEffect(() => {
    if (!isReaderModeAvailable) {
      enableReaderMode(initialModeRef.current);
    } else {
      // Preserve the previously selected reader mode across surah navigations.
      enableReaderMode(mode);
    }
  }, [enableReaderMode, isReaderModeAvailable, mode]);

  const chapterId = useMemo(() => {
    if (resourceKind === 'surah') {
      const parsed = Number.parseInt(resourceId, 10);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
    return verseListing.verses[0]?.chapter_id ?? initialVerses?.[0]?.chapter_id ?? undefined;
  }, [resourceKind, resourceId, verseListing.verses, initialVerses]);

  const handleReadingPanelOpen = useCallback(() => {
    setMode('mushaf');
  }, [setMode]);

  const handleTranslationTabOpen = useCallback(() => {
    setMode('verse');
  }, [setMode]);

  const surahId = useMemo(() => {
    if (resourceKind === 'surah') {
      const parsed = Number.parseInt(resourceId, 10);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
    return verseListing.verses[0]?.chapter_id ?? initialVerses?.[0]?.chapter_id ?? undefined;
  }, [resourceKind, resourceId, verseListing.verses, initialVerses]);

  const surahMain = createSurahMain({
    surahId,
    verseListing,
    ...(typeof emptyLabelKey === 'string' ? { emptyLabelKey } : {}),
    ...(typeof endLabelKey === 'string' ? { endLabelKey } : {}),
    ...(typeof initialVerseKey === 'string' ? { initialVerseKey } : {}),
    ...(typeof initialScrollNonce === 'string' ? { initialScrollNonce } : {}),
    ...(resourceKind === 'surah' && typeof chapterId === 'number' ? { chapterId } : {}),
  });

  const mushafMain = (
    <MushafMain
      mushafName={panels.selectedMushafName ?? 'Mushaf view'}
      mushafId={panels.selectedMushafId}
      pages={mushafView.pages}
      chapterId={chapterId}
      isLoading={mushafView.isLoading}
      isLoadingMore={mushafView.isLoadingMore}
      hasMore={mushafView.hasMore}
      onLoadMore={mushafView.loadMore}
      error={mushafView.error}
      endLabelKey={endLabelKey}
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
  const centerContentClassName = mode === 'mushaf' ? 'px-0 sm:px-0 lg:px-0' : undefined;

  return (
    <WorkspaceReaderLayout
      main={mainContent}
      desktopLeft={<SurahWorkspaceNavigation />}
      desktopRight={workspaceSettingsSidebar}
      mobileLeft={<SurahListSidebar />}
      mobileRight={settingsSidebar}
      audio={audioProps}
      {...(centerContentClassName ? { contentClassName: centerContentClassName } : {})}
    />
  );
}
