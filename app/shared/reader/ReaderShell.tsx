'use client';

import React from 'react';

import { SurahMain } from '@/app/(features)/surah/components/surah-view/SurahMain';
import { SurahSettings } from '@/app/(features)/surah/components/surah-view/SurahSettings';
import { SurahWorkspaceNavigation } from '@/app/(features)/surah/components/surah-view/SurahWorkspaceNavigation';
import { SurahWorkspaceSettings } from '@/app/(features)/surah/components/surah-view/SurahWorkspaceSettings';
import { useBodyOverflowHidden } from '@/app/(features)/surah/components/surah-view/useBodyOverflowHidden';
import { SurahListSidebar } from '@/app/shared/SurahListSidebar';

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
  initialVerseKey?: string;
}

const createSurahMain = ({
  verseListing,
  emptyLabelKey,
  endLabelKey,
  initialVerseKey,
}: CreateSurahMainParams): React.ReactNode => (
  <SurahMain
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

const createSettingsSidebar = (panels: ReaderPanelsState): React.ReactNode => (
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
);

const createWorkspaceSettingsPanel = (panels: ReaderPanelsState): React.ReactNode => (
  <SurahWorkspaceSettings
    selectedTranslationName={panels.selectedTranslationName}
    selectedWordLanguageName={panels.selectedWordLanguageName}
    isTranslationPanelOpen={panels.isTranslationPanelOpen}
    onTranslationPanelOpen={panels.openTranslationPanel}
    onTranslationPanelClose={panels.closeTranslationPanel}
    isWordLanguagePanelOpen={panels.isWordLanguagePanelOpen}
    onWordLanguagePanelOpen={panels.openWordLanguagePanel}
    onWordLanguagePanelClose={panels.closeWordLanguagePanel}
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
  initialVerseNumber?: number;
  initialVerseKey?: string;
}

export function ReaderShell({
  resourceId,
  lookup,
  initialVerses,
  emptyLabelKey,
  endLabelKey,
  initialVerseNumber,
  initialVerseKey,
}: ReaderShellProps): React.JSX.Element {
  useBodyOverflowHidden();
  const readerView = useReaderView({
    resourceId,
    lookup,
    initialVerses,
    initialVerseNumber,
  });
  const { verseListing, panels } = readerView;

  const surahMain = createSurahMain({
    verseListing,
    emptyLabelKey,
    endLabelKey,
    initialVerseKey,
  });
  const settingsSidebar = createSettingsSidebar(panels);
  const workspaceSettingsSidebar = createWorkspaceSettingsPanel(panels);
  const audioProps = mapToAudioProps(verseListing);

  return (
    <WorkspaceReaderLayout
      main={surahMain}
      desktopLeft={<SurahWorkspaceNavigation />}
      desktopRight={workspaceSettingsSidebar}
      mobileLeft={<SurahListSidebar />}
      mobileRight={settingsSidebar}
      audio={audioProps}
    />
  );
}
