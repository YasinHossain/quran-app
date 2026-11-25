'use client';

import React from 'react';

import { SurahListContent } from '@/app/shared/components/SurahListContent';
import { useSurahNavigationData } from '@/app/shared/navigation/hooks/useSurahNavigationData';

import type { Chapter } from '@/types';

interface SurahWorkspaceNavigationProps {
  initialChapters?: Chapter[];
}

export function SurahWorkspaceNavigation({
  initialChapters = [],
}: SurahWorkspaceNavigationProps): React.JSX.Element {
  const { chapters } = useSurahNavigationData({ initialChapters });

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground h-full">
      <SurahListContent chapters={chapters} />
    </div>
  );
}
