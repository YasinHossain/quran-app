import React from 'react';

import { Juz } from '@/app/shared/surah-sidebar/Juz';
import { Page } from '@/app/shared/surah-sidebar/Page';
import { Surah } from '@/app/shared/surah-sidebar/Surah';

import type { JuzSummary, TabKey } from '@/app/shared/components/surah-tabs/types';
import type { Chapter } from '@/types';

interface BaseProps {
  rememberScroll: (tab: TabKey) => void;
}

interface SurahProps extends BaseProps {
  filteredChapters: ReadonlyArray<Chapter>;
  selectedSurahId: number | null;
  setSelectedSurahId: (id: number | null) => void;
  setSelectedPageId: (id: number | null) => void;
  setSelectedJuzId: (id: number | null) => void;
  isTafsirPath: boolean;
}

export function SurahTabContent(props: SurahProps): React.JSX.Element {
  const {
    filteredChapters,
    selectedSurahId,
    setSelectedSurahId,
    setSelectedPageId,
    setSelectedJuzId,
    rememberScroll,
    isTafsirPath,
  } = props;
  return (
    <Surah
      chapters={filteredChapters}
      selectedSurahId={selectedSurahId}
      setSelectedSurahId={setSelectedSurahId}
      setSelectedPageId={setSelectedPageId}
      setSelectedJuzId={setSelectedJuzId}
      rememberScroll={() => rememberScroll('Surah')}
      isTafsirPath={isTafsirPath}
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
    />
  );
}
