import React from 'react';

import type { JuzSummary, TabKey } from '@/app/shared/components/surah-tabs/types';
import type { Chapter } from '@/types';

import { Juz } from '@/app/shared/components/surah-sidebar/Juz';
import { Page } from '@/app/shared/components/surah-sidebar/Page';
import { Surah } from '@/app/shared/components/surah-sidebar/Surah';

interface TabContentProps {
  activeTab: TabKey;
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
  rememberScroll: (tab: TabKey) => void;
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
