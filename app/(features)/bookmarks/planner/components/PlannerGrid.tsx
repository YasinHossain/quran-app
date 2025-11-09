'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import { buildPlannerGroupCardData } from '@/app/(features)/bookmarks/planner/utils/buildPlannerGroupCard';
import {
  buildChapterLookup,
  groupPlannerPlans,
} from '@/app/(features)/bookmarks/planner/utils/planGrouping';
import { CalendarIcon } from '@/app/shared/icons';
import { PlannerPlan, Chapter } from '@/types';

import { PlannerCard } from './PlannerCard';

interface DeletePlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  planIds: string[] | null;
  groupKey: string | null;
  title: string;
  details: string | null;
}

const DeletePlannerModal = dynamic<DeletePlannerModalProps>(
  () =>
    import('./DeletePlannerModal').then((mod) => ({
      default: mod.DeletePlannerModal,
    })),
  { ssr: false }
);

interface PlannerGridProps {
  planner: Record<string, PlannerPlan>;
  chapters: Chapter[];
}

export const PlannerGrid = ({ planner, chapters }: PlannerGridProps): React.JSX.Element => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deleteInfo, setDeleteInfo] = React.useState<{
    key: string;
    planIds: string[];
    title: string;
    details: string | null;
  } | null>(null);
  const chapterLookup = React.useMemo(() => buildChapterLookup(chapters), [chapters]);
  const groupedCards = React.useMemo(() => {
    const groups = groupPlannerPlans(planner, chapterLookup);
    return groups.map((group) => buildPlannerGroupCardData(group, chapterLookup));
  }, [planner, chapterLookup]);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const openDelete = React.useCallback((group: ReturnType<typeof buildPlannerGroupCardData>) => {
    setDeleteInfo({
      key: group.key,
      planIds: group.planIds,
      title: group.viewModel.planInfo.displayPlanName,
      details: group.viewModel.planInfo.planDetailsText ?? null,
    });
    setIsDeleteOpen(true);
  }, []);

  const closeDelete = React.useCallback(() => {
    setIsDeleteOpen(false);
    setDeleteInfo(null);
  }, []);

  if (!planner || Object.keys(planner).length === 0 || groupedCards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
          <CalendarIcon className="w-8 h-8 text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Create Your First Plan</h3>
        <p className="text-muted max-w-md mx-auto">
          Tap the <span className="font-semibold text-foreground">+</span> button in the top-right
          corner to build a plan and track your memorization journey.
        </p>
      </div>
    );
  }

  return (
    <>
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
            {...(group.continueVerse ? { continueVerse: group.continueVerse } : {})}
            onDelete={() => openDelete(group)}
          />
        ))}
      </div>

      {/* Delete confirmation modal */}
      <DeletePlannerModal
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        planIds={deleteInfo?.planIds ?? null}
        groupKey={deleteInfo?.key ?? null}
        title={deleteInfo?.title ?? ''}
        details={deleteInfo?.details ?? null}
      />
    </>
  );
};
