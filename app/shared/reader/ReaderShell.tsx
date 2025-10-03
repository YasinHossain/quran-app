'use client';

import React from 'react';

import { SurahAudio } from '@/app/(features)/surah/components/surah-view/SurahAudio';
import { SurahMain } from '@/app/(features)/surah/components/surah-view/SurahMain';
import { SurahSettings } from '@/app/(features)/surah/components/surah-view/SurahSettings';
import { useBodyOverflowHidden } from '@/app/(features)/surah/components/surah-view/useBodyOverflowHidden';

import { useReaderView } from './useReaderView';

import type { LookupFn, UseVerseListingParams } from '@/app/(features)/surah/hooks/useVerseListing';

interface ReaderShellProps extends Pick<UseVerseListingParams, 'initialVerses'> {
  resourceId: string;
  lookup: LookupFn;
  emptyLabelKey?: string;
  endLabelKey?: string;
}

export function ReaderShell({
  resourceId,
  lookup,
  initialVerses,
  emptyLabelKey,
  endLabelKey,
}: ReaderShellProps): React.JSX.Element {
  useBodyOverflowHidden();
  const { verseListing, panels } = useReaderView({
    resourceId,
    lookup,
    initialVerses,
  });

  return (
    <>
      <SurahMain
        verses={verseListing.verses}
        isLoading={verseListing.isLoading}
        error={verseListing.error}
        loadMoreRef={verseListing.loadMoreRef}
        isValidating={verseListing.isValidating}
        isReachingEnd={verseListing.isReachingEnd}
        emptyLabelKey={emptyLabelKey}
        endLabelKey={endLabelKey}
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
