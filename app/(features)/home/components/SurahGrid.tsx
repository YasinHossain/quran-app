'use client';

import { memo } from 'react';

import { NavigationCardGrid } from './NavigationCardGrid';
import { SurahCard } from './SurahCard';

import type { Chapter } from '@/types';

interface SurahGridProps {
  chapters: ReadonlyArray<Chapter>;
}

/**
 * Grid component for displaying surah navigation cards.
 * Optimized using memoization on individual cards (SurahCard) instead of virtualization.
 */
export const SurahGrid = memo(function SurahGrid({ chapters }: SurahGridProps) {
  return (
    <NavigationCardGrid className="pb-4">
      {chapters.map((chapter) => (
        <SurahCard key={chapter.id} chapter={chapter} />
      ))}
    </NavigationCardGrid>
  );
});
