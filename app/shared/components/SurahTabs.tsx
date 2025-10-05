'use client';

import { memo } from 'react';

import { SurahTabsView } from '@/app/shared/components/surah-tabs/SurahTabsView';
import { useSurahTabsState } from '@/app/shared/components/surah-tabs/useSurahTabsState';

import type { SurahTabsProps } from '@/app/shared/components/surah-tabs/types';

export const SurahTabs = memo(function SurahTabs(props: SurahTabsProps) {
  const state = useSurahTabsState(props.chapters);

  return <SurahTabsView {...props} {...state} />;
});
