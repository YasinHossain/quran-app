import React from 'react';

import { JuzTabContent, PageTabContent, SurahTabContent } from './TabContentViews';

import type { JuzSummary, TabKey } from '@/app/shared/components/surah-tabs/types';
import type { Chapter } from '@/types';

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

export const TabContent = (props: TabContentProps): React.JSX.Element => renderTabContent(props);

function renderTabContent(props: TabContentProps): React.JSX.Element {
  if (props.activeTab === 'Surah') return <SurahTabContent {...props} />;
  if (props.activeTab === 'Juz') return <JuzTabContent {...props} />;
  return <PageTabContent {...props} />;
}
