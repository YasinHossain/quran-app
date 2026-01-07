import React from 'react';

import { Juz } from '@/app/shared/surah-sidebar/Juz';
import { Page } from '@/app/shared/surah-sidebar/Page';
import { Surah } from '@/app/shared/surah-sidebar/Surah';

import type { JuzSummary, TabKey } from '@/app/shared/components/surah-tabs/types';
import type { Chapter } from '@/types';

interface BaseProps {
  rememberScroll: (tab: TabKey) => void;
  scrollParent: HTMLElement;
  onClose?: (() => void) | undefined;
}

interface SurahProps extends BaseProps {
  filteredChapters: ReadonlyArray<Chapter>;
  selectedSurahId: number | null;
  setSelectedSurahId: (id: number | null) => void;
  setSelectedPageId: (id: number | null) => void;
  setSelectedJuzId: (id: number | null) => void;
  isTafsirPath: boolean;
  isMushafMode: boolean;
}

export function SurahTabContent(props: SurahProps): React.JSX.Element {
  const {
    filteredChapters,
    selectedSurahId,
    setSelectedSurahId,
    setSelectedPageId,
    setSelectedJuzId,
    rememberScroll,
    scrollParent,
    isTafsirPath,
    isMushafMode,
    onClose,
  } = props;
  return (
    <Surah
      chapters={filteredChapters}
      selectedSurahId={selectedSurahId}
      setSelectedSurahId={setSelectedSurahId}
      setSelectedPageId={setSelectedPageId}
      setSelectedJuzId={setSelectedJuzId}
      rememberScroll={() => rememberScroll('Surah')}
      scrollParent={scrollParent}
      isTafsirPath={isTafsirPath}
      isMushafMode={isMushafMode}
      onClose={onClose}
    />
  );
}

interface JuzProps extends BaseProps {
  filteredJuzs: JuzSummary[];
  chapters: ReadonlyArray<Chapter>;
  selectedJuzId: number | null;
  setSelectedJuzId: (id: number | null) => void;
  setSelectedPageId: (id: number | null) => void;
  setSelectedSurahId: (id: number | null) => void;
  isMushafMode: boolean;
}

export function JuzTabContent(props: JuzProps): React.JSX.Element {
  const {
    filteredJuzs,
    chapters,
    selectedJuzId,
    setSelectedJuzId,
    setSelectedPageId,
    setSelectedSurahId,
    rememberScroll,
    scrollParent,
    onClose,
  } = props;
  return (
    <Juz
      juzs={filteredJuzs}
      chapters={chapters}
      selectedJuzId={selectedJuzId}
      setSelectedJuzId={setSelectedJuzId}
      setSelectedPageId={setSelectedPageId}
      setSelectedSurahId={setSelectedSurahId}
      rememberScroll={() => rememberScroll('Juz')}
      scrollParent={scrollParent}
      onClose={onClose}
    />
  );
}

interface PageProps extends BaseProps {
  filteredPages: number[];
  chapters: ReadonlyArray<Chapter>;
  selectedPageId: number | null;
  setSelectedPageId: (id: number | null) => void;
  setSelectedJuzId: (id: number | null) => void;
  setSelectedSurahId: (id: number | null) => void;
  isMushafMode: boolean;
}

export function PageTabContent(props: PageProps): React.JSX.Element {
  const {
    filteredPages,
    chapters,
    selectedPageId,
    setSelectedPageId,
    setSelectedJuzId,
    setSelectedSurahId,
    rememberScroll,
    scrollParent,
    onClose,
  } = props;
  return (
    <Page
      pages={filteredPages}
      chapters={chapters}
      selectedPageId={selectedPageId}
      setSelectedPageId={setSelectedPageId}
      setSelectedJuzId={setSelectedJuzId}
      setSelectedSurahId={setSelectedSurahId}
      rememberScroll={() => rememberScroll('Page')}
      scrollParent={scrollParent}
      onClose={onClose}
    />
  );
}
