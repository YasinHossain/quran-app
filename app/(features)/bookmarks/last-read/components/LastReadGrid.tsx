'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { Chapter } from '@/types';

import { LastReadCard } from './LastReadCard';

interface LastReadGridProps {
  lastRead: Record<string, number>;
  chapters: Chapter[];
}

export const LastReadGrid = ({ lastRead, chapters }: LastReadGridProps): React.JSX.Element => {
  if (Object.keys(lastRead).length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Recent Activity</h3>
        <p className="text-muted max-w-md mx-auto">
          Start reading the Quran and your progress will be automatically tracked here.
        </p>
      </div>
    );
  }

  const validEntries = Object.entries(lastRead).filter(([surahId, verseId]) => {
    const chapter = chapters.find((c) => c.id === Number(surahId));
    const total = chapter?.verses_count || 0;
    return total > 0 && verseId <= total && verseId > 0;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 sm:gap-5 xl:gap-6"
    >
      {validEntries.map(([surahId, verseId], index) => {
        const chapter = chapters.find((c) => c.id === Number(surahId));
        return (
          <LastReadCard
            key={surahId}
            surahId={surahId}
            verseId={verseId}
            {...(chapter && { chapter })}
            index={index}
          />
        );
      })}
    </motion.div>
  );
};
