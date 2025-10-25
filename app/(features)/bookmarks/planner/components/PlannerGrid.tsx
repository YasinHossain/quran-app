'use client';

import React from 'react';

import { CalendarIcon, PlusIcon } from '@/app/shared/icons';
import { PlannerPlan, Chapter } from '@/types';

import {
  buildChapterLookup,
  groupPlannerPlans,
} from '@/app/(features)/bookmarks/planner/utils/planGrouping';
import { buildPlannerGroupCardData } from '@/app/(features)/bookmarks/planner/utils/buildPlannerGroupCard';

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
  const chapterLookup = React.useMemo(() => buildChapterLookup(chapters), [chapters]);
  const groupedCards = React.useMemo(() => {
    const groups = groupPlannerPlans(planner, chapterLookup);
    return groups.map((group) => buildPlannerGroupCardData(group, chapterLookup));
  }, [planner, chapterLookup]);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!planner || Object.keys(planner).length === 0 || groupedCards.length === 0) {
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
      className={`grid w-full auto-rows-auto grid-auto-fit [--min-col:18rem] lg:[--min-col:20rem] xl:[--min-col:24rem] 2xl:[--min-col:28rem] gap-y-4 md:gap-y-6 xl:gap-y-8 gap-x-3 md:gap-x-4 xl:gap-x-6 transition-opacity duration-300 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {groupedCards.map((group) => (
        <PlannerCard
          key={group.key}
          surahId={group.surahId}
          plan={group.plan}
          {...(group.chapter && { chapter: group.chapter })}
          precomputedViewModel={group.viewModel}
          progressLabel={group.progressLabel}
        />
      ))}
    </div>
  );
};
