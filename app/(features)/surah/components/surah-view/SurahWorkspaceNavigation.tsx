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
    <div className="flex h-full flex-col bg-surface text-foreground">
      <div className="flex-1 overflow-y-auto">
        <SurahListContent chapters={chapters} />
      </div>
    </div>
  );
}
