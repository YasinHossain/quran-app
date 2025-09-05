'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { BrainIcon, PlusIcon } from '@/app/shared/icons';
import { MemorizationPlan, Chapter } from '@/types';

import { MemorizationCard } from './MemorizationCard';

interface MemorizationGridProps {
  memorization: Record<string, MemorizationPlan>;
  chapters: Chapter[];
  onCreatePlan: () => void;
}

export const MemorizationGrid = ({
  memorization,
  chapters,
  onCreatePlan,
}: MemorizationGridProps): React.JSX.Element => {
  if (!memorization || Object.keys(memorization).length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
          <BrainIcon className="w-8 h-8 text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Memorization Plans</h3>
        <p className="text-muted max-w-md mx-auto mb-6">
          Start your memorization journey by creating a plan to track your progress.
        </p>
        <button
          onClick={onCreatePlan}
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-hover transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <PlusIcon size={20} />
          Create Memorization Plan
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Object.entries(memorization).map(([surahId, plan]) => {
        const chapter = chapters.find((c) => c.id === Number(surahId));
        return (
          <MemorizationCard
            key={surahId}
            surahId={surahId}
            plan={plan}
            {...(chapter && {
              chapter: { name_simple: chapter.name_simple, name_arabic: chapter.name_arabic },
            })}
          />
        );
      })}
    </motion.div>
  );
};
