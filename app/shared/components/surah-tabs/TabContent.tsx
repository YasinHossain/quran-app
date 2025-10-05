import dynamic from 'next/dynamic';
import React from 'react';

import { SurahTabContent } from './TabContentViews';

import type { JuzSummary, TabKey } from '@/app/shared/components/surah-tabs/types';
import type { Chapter } from '@/types';

interface TabContentProps {
  activeTab: TabKey;
  filteredChapters: ReadonlyArray<Chapter>;
  filteredJuzs: JuzSummary[];
  filteredPages: number[];
  chapters: ReadonlyArray<Chapter>;
  selectedSurahId: number | null;
  setSelectedSurahId: (id: number | null) => void;
  selectedJuzId: number | null;
  setSelectedJuzId: (id: number | null) => void;
  selectedPageId: number | null;
  setSelectedPageId: (id: number | null) => void;
  rememberScroll: (tab: TabKey) => void;
  isTafsirPath: boolean;
}

// Adapt dynamically loaded components to accept TabContentProps at call sites
const JuzTabContent = dynamic<TabContentProps>(() =>
  import('./TabContentViews').then((mod) => ({
    default: (props: TabContentProps) => <mod.JuzTabContent {...props} />,
  }))
);

const PageTabContent = dynamic<TabContentProps>(() =>
  import('./TabContentViews').then((mod) => ({
    default: (props: TabContentProps) => <mod.PageTabContent {...props} />,
  }))
);

export const TabContent = (props: TabContentProps): React.JSX.Element => renderTabContent(props);

function renderTabContent(props: TabContentProps): React.JSX.Element {
  if (props.activeTab === 'Surah') return <SurahTabContent {...props} />;
  if (props.activeTab === 'Juz') return <JuzTabContent {...props} />;
  return <PageTabContent {...props} />;
}
