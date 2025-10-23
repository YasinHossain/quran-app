'use client';

import React from 'react';

import { CalendarIcon, PlusIcon } from '@/app/shared/icons';
import { PlannerPlan, Chapter } from '@/types';

import { PlannerCard } from './PlannerCard';

interface PlannerGridProps {
  planner: Record<string, PlannerPlan>;
  chapters: Chapter[];
  onCreatePlan: () => void;
}

export const PlannerGrid = ({
  planner,
  chapters,
  onCreatePlan,
}: PlannerGridProps): React.JSX.Element => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!planner || Object.keys(planner).length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
          <CalendarIcon className="w-8 h-8 text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Plans Yet</h3>
        <p className="text-muted max-w-md mx-auto mb-6">
          Start planning your memorization journey by creating a plan to track your progress.
        </p>
        <button
          onClick={onCreatePlan}
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-on-accent rounded-xl font-semibold hover:bg-accent-hover transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <PlusIcon size={20} />
          Create Plan
        </button>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 gap-4 transition-opacity duration-300 ease-out sm:grid-cols-2 lg:grid-cols-3 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {Object.entries(planner).map(([surahId, plan]) => {
        const chapter = chapters.find((c) => c.id === Number(surahId));
        return (
          <PlannerCard
            key={surahId}
            surahId={surahId}
            plan={plan}
            {...(chapter && {
              chapter: {
                name_simple: chapter.name_simple,
                name_arabic: chapter.name_arabic,
                pages: chapter.pages,
              },
            })}
          />
        );
      })}
    </div>
  );
};
