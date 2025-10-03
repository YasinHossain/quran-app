import dynamic from 'next/dynamic';
import React, { type ComponentType } from 'react';

import { SurahTabContent } from './TabContentViews';

import type { JuzSummary, TabKey } from '@/app/shared/components/surah-tabs/types';
import type { Chapter } from '@/types';

interface TabContentProps {
  activeTab: TabKey;
  filteredChapters: Chapter[];
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

const JuzTabContent = dynamic<ComponentType<TabContentProps>>(() =>
  import('./TabContentViews').then((mod) => ({ default: mod.JuzTabContent }))
);

const PageTabContent = dynamic<ComponentType<TabContentProps>>(() =>
  import('./TabContentViews').then((mod) => ({ default: mod.PageTabContent }))
);

export const TabContent = (props: TabContentProps): React.JSX.Element => renderTabContent(props);

function renderTabContent(props: TabContentProps): React.JSX.Element {
  if (props.activeTab === 'Surah') return <SurahTabContent {...props} />;
  if (props.activeTab === 'Juz') return <JuzTabContent {...props} />;
  return <PageTabContent {...props} />;
}
