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
  filteredChapters: Chapter[];
  selectedSurahId: number | undefined;
  setSelectedSurahId: (id: number | undefined) => void;
  setSelectedPageId: (id: number | undefined) => void;
  setSelectedJuzId: (id: number | undefined) => void;
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
  chapters: Chapter[];
  selectedJuzId: number | undefined;
  setSelectedJuzId: (id: number | undefined) => void;
  setSelectedPageId: (id: number | undefined) => void;
  setSelectedSurahId: (id: number | undefined) => void;
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
  chapters: Chapter[];
  selectedPageId: number | undefined;
  setSelectedPageId: (id: number | undefined) => void;
  setSelectedJuzId: (id: number | undefined) => void;
  setSelectedSurahId: (id: number | undefined) => void;
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
