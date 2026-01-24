'use client';

import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';

import { SurahMain } from '@/app/(features)/surah/components/surah-view/SurahMain';
import { SurahWorkspaceNavigation } from '@/app/(features)/surah/components/surah-view/SurahWorkspaceNavigation';
import { useReaderMode } from '@/app/providers/ReaderModeContext';
import { useUIState } from '@/app/providers/UIStateContext';
import { SettingsSidebar } from '@/app/shared/reader/settings';
import { SettingsSidebarContent } from '@/app/shared/reader/settings/SettingsSidebarContent';
import { SurahListSidebar } from '@/app/shared/SurahListSidebar';

// Dynamic import for MushafMain - only loaded when user switches to reading/mushaf mode
const MushafMain = dynamic(
  () =>
    import('@/app/(features)/surah/components/surah-view/MushafMain').then((mod) => mod.MushafMain),
  {
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted">Loading Mushaf view...</div>
      </div>
    ),
    ssr: false,
  }
);

import { ReaderAudioProps, WorkspaceReaderLayout } from './ReaderLayouts';
import { useReaderView } from './useReaderView';

import type { MushafResourceKind } from '@/app/(features)/surah/hooks/mushafReadingViewTypes';
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
    verseListing={verseListing}
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
  totalVerses?: number | undefined;
  initialVersesParams?: UseVerseListingParams['initialVersesParams'];
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
  totalVerses,
  initialVersesParams,
  initialVerseNumber,
  initialVerseKey,
  initialScrollNonce,
  initialMode = 'verse',
}: ReaderShellProps): React.JSX.Element {
  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  const { mode, setMode, enableReaderMode, isReaderModeAvailable } = useReaderMode();
  const { setSettingsOpen } = useUIState();
  const readerView = useReaderView({
    resourceId,
    resourceKind,
    lookup,
    initialVerses,
    ...(typeof totalVerses === 'number' ? { totalVerses } : {}),
    ...(initialVersesParams ? { initialVersesParams } : {}),
    ...(typeof initialVerseNumber === 'number' ? { initialVerseNumber } : {}),
  });
  const { verseListing, panels, mushafParams } = readerView;

  // Use a layout effect so mode changes (esp. `initialMode="mushaf"`) don't flash on refresh.
  useIsomorphicLayoutEffect(() => {
    if (!isReaderModeAvailable) {
      enableReaderMode(initialMode);
    } else {
      // Preserve the previously selected reader mode across surah navigations.
      enableReaderMode(mode);
    }
  }, [enableReaderMode, initialMode, isReaderModeAvailable, mode]);

  // Avoid rendering a "verse" frame before hydration when we already know the intended initial mode.
  const resolvedMode = isReaderModeAvailable ? mode : initialMode;

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
    setSettingsOpen(false);
  }, [setMode, setSettingsOpen]);

  const handleTranslationTabOpen = useCallback(() => {
    setMode('verse');
    setSettingsOpen(false);
  }, [setMode, setSettingsOpen]);

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
      resourceId={resourceId}
      resourceKind={resourceKind}
      {...(typeof mushafParams.initialPageNumber === 'number'
        ? { initialPageNumber: mushafParams.initialPageNumber }
        : {})}
      {...(typeof initialVerseKey === 'string' ? { initialVerseKey } : {})}
      chapterId={chapterId}
      {...(typeof mushafParams.juzNumber === 'number' ? { juzNumber: mushafParams.juzNumber } : {})}
      {...(typeof mushafParams.reciterId === 'number' ? { reciterId: mushafParams.reciterId } : {})}
      {...(mushafParams.wordByWordLocale
        ? { wordByWordLocale: mushafParams.wordByWordLocale }
        : {})}
      {...(mushafParams.translationIds ? { translationIds: mushafParams.translationIds } : {})}
      endLabelKey={endLabelKey}
    />
  );
  const mainContent = resolvedMode === 'mushaf' ? mushafMain : surahMain;
  const activeReaderTab = resolvedMode === 'mushaf' ? 'reading' : 'translation';
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
  const centerContentClassName =
    resolvedMode === 'mushaf' ? 'px-0 sm:px-0 lg:px-0' : undefined;

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
