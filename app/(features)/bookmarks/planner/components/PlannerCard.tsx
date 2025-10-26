'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { DailyFocusSection } from '@/app/(features)/bookmarks/planner/components/DailyFocusSection';
import { PlannerCardHeader } from '@/app/(features)/bookmarks/planner/components/PlannerCardHeader';
import { PlannerProgressSection } from '@/app/(features)/bookmarks/planner/components/PlannerProgressSection';
import { PlannerStatsSection } from '@/app/(features)/bookmarks/planner/components/PlannerStatsSection';
import { createPlannerCardViewModel } from '@/app/(features)/bookmarks/planner/utils/plannerCard';

import type { PlannerCardProps } from '@/app/(features)/bookmarks/planner/components/PlannerCard.types';
import { CloseIcon } from '@/app/shared/icons';

export const PlannerCard = ({
  surahId,
  plan,
  chapter,
  precomputedViewModel,
  progressLabel,
  onDelete,
}: PlannerCardProps & { onDelete?: () => void }): React.JSX.Element => {
  const router = useRouter();
  const viewModel = React.useMemo(() => {
    if (precomputedViewModel) {
      return precomputedViewModel;
    }
    const params: PlannerCardProps = chapter ? { surahId, plan, chapter } : { surahId, plan };
    return createPlannerCardViewModel(params);
  }, [precomputedViewModel, surahId, plan, chapter]);

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
    <div className="cq relative flex min-w-0 h-full transform flex-col rounded-3xl border border-border/60 bg-surface p-6 shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 sm:p-7 lg:min-w-[20rem] xl:min-w-[24rem] 2xl:min-w-[28rem]">
      <div className="relative z-10 flex h-full flex-col gap-6">
        {onDelete ? (
          <button
            type="button"
            aria-label="Delete planner"
            className="absolute right-4 top-4 rounded-lg p-2 text-muted hover:bg-surface-hover hover:text-error transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
          >
            <CloseIcon size={18} />
          </button>
        ) : null}
        <PlannerCardHeader
          displayPlanName={viewModel.planInfo.displayPlanName}
          planDetailsText={viewModel.planInfo.planDetailsText}
        />

        <DailyFocusSection focus={viewModel.focus} />

        <PlannerStatsSection stats={viewModel.stats} />

        <div className="mt-auto">
          <PlannerProgressSection
            progress={viewModel.progress}
            surahLabel={viewModel.planInfo.surahLabel}
            surahId={surahId}
            {...(typeof progressLabel === 'string' ? { currentVerseLabel: progressLabel } : {})}
            onContinue={handleContinueClick}
          />
        </div>
      </div>
    </div>
  );
};
