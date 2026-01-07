'use client';

import { memo, forwardRef } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';

import { SurahCard } from './SurahCard';

import type { Chapter } from '@/types';

interface SurahGridProps {
  chapters: ReadonlyArray<Chapter>;
}

const GridList = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => (
  <div
    ref={ref}
    {...props}
    className="grid w-full auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-2.5 md:gap-y-3 xl:gap-y-4 gap-x-2.5 md:gap-x-3 xl:gap-x-4 pb-4"
  />
));

const GridItem = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => (
  <div ref={ref} {...props} className="h-full" />
));

/**
 * Grid component for displaying surah navigation cards using virtualization for performance.
 */
export const SurahGrid = memo(function SurahGrid({ chapters }: SurahGridProps) {
  return (
    <VirtuosoGrid
      useWindowScroll
      data={chapters}
      components={{
        List: GridList,
        Item: GridItem,
      }}
      itemContent={(index, chapter) => <SurahCard chapter={chapter} />}
    />
  );
});
