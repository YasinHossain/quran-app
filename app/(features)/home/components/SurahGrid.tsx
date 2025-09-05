'use client';

import { memo } from 'react';

import { SurahCard } from './SurahCard';

import type { Surah } from '@/types';

interface SurahGridProps {
  surahs: Surah[];
}

/**
 * Grid component for displaying surah cards
 * Uses responsive grid layout with proper spacing
 */
export const SurahGrid = memo(function SurahGrid({ surahs }: SurahGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {surahs.map((surah) => (
        <SurahCard key={surah.number} surah={surah} />
      ))}
    </div>
  );
});
