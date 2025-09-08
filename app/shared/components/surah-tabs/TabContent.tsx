import React from 'react';

import { Juz } from '../../surah-sidebar/Juz';
import { Page } from '../../surah-sidebar/Page';
import { Surah } from '../../surah-sidebar/Surah';

import type { Chapter } from '@/types';

interface JuzSummary {
  number: number;
  name: string;
  surahRange: string;
}

interface TabContentProps {
  activeTab: 'Surah' | 'Juz' | 'Page';
  filteredChapters: Chapter[];
  filteredJuzs: JuzSummary[];
  filteredPages: number[];
  chapters: Chapter[];
  selectedSurahId: number | undefined;
  setSelectedSurahId: (id: number | undefined) => void;
  selectedJuzId: number | undefined;
  setSelectedJuzId: (id: number | undefined) => void;
  selectedPageId: number | undefined;
  setSelectedPageId: (id: number | undefined) => void;
  rememberScroll: (tab: string) => void;
  isTafsirPath: boolean;
}

export const TabContent = ({
  activeTab,
  filteredChapters,
  filteredJuzs,
  filteredPages,
  chapters,
  selectedSurahId,
  setSelectedSurahId,
  selectedJuzId,
  setSelectedJuzId,
  selectedPageId,
  setSelectedPageId,
  rememberScroll,
  isTafsirPath,
}: TabContentProps): React.JSX.Element => {
  if (activeTab === 'Surah') {
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

  if (activeTab === 'Juz') {
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
};
