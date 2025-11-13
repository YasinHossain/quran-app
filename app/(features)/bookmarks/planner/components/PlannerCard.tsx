'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { DailyFocusSection } from '@/app/(features)/bookmarks/planner/components/DailyFocusSection';
import { PlannerCardHeader } from '@/app/(features)/bookmarks/planner/components/PlannerCardHeader';
import { PlannerProgressSection } from '@/app/(features)/bookmarks/planner/components/PlannerProgressSection';
import { PlannerStatsSection } from '@/app/(features)/bookmarks/planner/components/PlannerStatsSection';
import { createPlannerCardViewModel } from '@/app/(features)/bookmarks/planner/utils/plannerCard';
import { CloseIcon } from '@/app/shared/icons';
import { buildSurahRoute } from '@/app/shared/navigation/routes';

import type { PlannerCardProps } from '@/app/(features)/bookmarks/planner/components/PlannerCard.types';
import type { PlannerCardViewModel } from '@/app/(features)/bookmarks/planner/utils/plannerCard';

export const PlannerCard = ({
  surahId,
  plan,
  chapter,
  precomputedViewModel,
  progressLabel,
  continueVerse,
  onDelete,
}: PlannerCardProps & { onDelete?: () => void }): React.JSX.Element => {
  const viewModel = usePlannerViewModel({
    surahId,
    plan,
    ...(chapter ? { chapter } : {}),
    ...(precomputedViewModel ? { precomputedViewModel } : {}),
  });
  const handleNavigate = usePlannerNavigation(surahId, continueVerse);

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
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <PlannerCardHeader
              displayPlanName={viewModel.planInfo.displayPlanName}
              planDetailsText={viewModel.planInfo.planDetailsText}
            />
          </div>
          <PlannerCardDeleteButton {...(onDelete ? { onDelete } : {})} />
        </div>

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

const usePlannerViewModel = ({
  surahId,
  plan,
  chapter,
  precomputedViewModel,
}: Pick<
  PlannerCardProps,
  'surahId' | 'plan' | 'chapter' | 'precomputedViewModel'
>): PlannerCardViewModel => {
  return React.useMemo<PlannerCardViewModel>(() => {
    if (precomputedViewModel) {
      return precomputedViewModel;
    }
    const params: PlannerCardProps = chapter ? { surahId, plan, chapter } : { surahId, plan };
    return createPlannerCardViewModel(params);
  }, [chapter, plan, precomputedViewModel, surahId]);
};

const usePlannerNavigation = (
  surahId: string,
  continueVerse: PlannerCardProps['continueVerse']
): (() => void) => {
  const router = useRouter();

  return React.useCallback(() => {
    const parsedSurahId = Number.parseInt(surahId, 10);
    const fallbackSurahId = Number.isFinite(parsedSurahId) ? parsedSurahId : surahId;
    const resolvedSurahId = continueVerse?.surahId ?? fallbackSurahId;
    const targetPath = buildSurahRoute(
      resolvedSurahId,
      continueVerse?.verse && continueVerse.verse > 0
        ? { startVerse: continueVerse.verse, forceSeq: true }
        : undefined
    );
    router.push(targetPath, { scroll: false });
  }, [continueVerse, router, surahId]);
};

const PlannerCardDeleteButton = ({
  onDelete,
}: {
  onDelete?: () => void;
}): React.JSX.Element | null => {
  if (!onDelete) return null;
  return (
    <button
      type="button"
      aria-label="Delete planner"
      className="shrink-0 rounded-lg p-2 text-muted hover:bg-surface-hover hover:text-error transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent/40 focus:outline-none"
      onClick={(event) => {
        event.stopPropagation();
        onDelete();
      }}
    >
      <CloseIcon size={18} />
    </button>
  );
};
