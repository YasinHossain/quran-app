'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { DailyFocusSection } from '@/app/(features)/bookmarks/planner/components/DailyFocusSection';
import { PlannerCardHeader } from '@/app/(features)/bookmarks/planner/components/PlannerCardHeader';
import { PlannerProgressSection } from '@/app/(features)/bookmarks/planner/components/PlannerProgressSection';
import { PlannerStatsSection } from '@/app/(features)/bookmarks/planner/components/PlannerStatsSection';
import { createPlannerCardViewModel } from '@/app/(features)/bookmarks/planner/utils/plannerCard';

import type { PlannerCardProps } from '@/app/(features)/bookmarks/planner/components/PlannerCard.types';

export const PlannerCard = ({ surahId, plan, chapter }: PlannerCardProps): React.JSX.Element => {
  const router = useRouter();
  const viewModel = createPlannerCardViewModel({ surahId, plan, chapter });

  const handleNavigate = React.useCallback((): void => {
    router.push(`/surah/${surahId}`);
  }, [router, surahId]);

  const handleContinueClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>): void => {
      event.stopPropagation();
      handleNavigate();
    },
    [handleNavigate]
  );

  return (
    <div className="relative flex h-full transform flex-col overflow-hidden rounded-3xl border border-border/60 bg-surface p-6 shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 sm:p-7">
      <div className="relative z-10 flex h-full flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <PlannerCardHeader
            displayPlanName={viewModel.planInfo.displayPlanName}
            planDetailsText={viewModel.planInfo.planDetailsText}
          />
          <DailyFocusSection focus={viewModel.focus} />
        </div>

        <PlannerStatsSection stats={viewModel.stats} />

        <div className="mt-auto">
          <PlannerProgressSection
            progress={viewModel.progress}
            surahLabel={viewModel.planInfo.surahLabel}
            surahId={surahId}
            onContinue={handleContinueClick}
          />
        </div>
      </div>
    </div>
  );
};
