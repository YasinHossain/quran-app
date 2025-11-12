'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import {
  buildPlannerGroupCardData,
  PlannerGroupCardData,
} from '@/app/(features)/bookmarks/planner/utils/buildPlannerGroupCard';
import {
  buildChapterLookup,
  groupPlannerPlans,
} from '@/app/(features)/bookmarks/planner/utils/planGrouping';
import { PlannerPlan, Chapter } from '@/types';

import { PlannerCard } from './PlannerCard';
import { PlannerGridEmptyState } from './PlannerGridEmptyState';

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
  const { groupedCards, hasPlans } = usePlannerGridGroups(planner, chapters);
  const { isDeleteOpen, deleteInfo, openDelete, closeDelete } = useDeleteModalState();

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!hasPlans) {
    return <PlannerGridEmptyState />;
  }

  return (
    <>
      <PlannerCardGrid groups={groupedCards} isVisible={isVisible} onDelete={openDelete} />

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

interface PlannerDeleteInfo {
  key: string;
  planIds: string[];
  title: string;
  details: string | null;
}

const usePlannerGridGroups = (
  planner: Record<string, PlannerPlan>,
  chapters: Chapter[]
): { groupedCards: PlannerGroupCardData[]; hasPlans: boolean } => {
  const chapterLookup = React.useMemo(() => buildChapterLookup(chapters), [chapters]);
  const groupedCards = React.useMemo(() => {
    const groups = groupPlannerPlans(planner, chapterLookup);
    return groups.map((group) => buildPlannerGroupCardData(group, chapterLookup));
  }, [planner, chapterLookup]);
  return { groupedCards, hasPlans: groupedCards.length > 0 };
};

const useDeleteModalState = (): {
  isDeleteOpen: boolean;
  deleteInfo: PlannerDeleteInfo | null;
  openDelete: (group: PlannerGroupCardData) => void;
  closeDelete: () => void;
} => {
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deleteInfo, setDeleteInfo] = React.useState<PlannerDeleteInfo | null>(null);

  const openDelete = React.useCallback((group: PlannerGroupCardData) => {
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

  return { isDeleteOpen, deleteInfo, openDelete, closeDelete };
};

const PlannerCardGrid = ({
  groups,
  isVisible,
  onDelete,
}: {
  groups: PlannerGroupCardData[];
  isVisible: boolean;
  onDelete: (group: PlannerGroupCardData) => void;
}): React.JSX.Element => (
  <div
    className={`grid w-full auto-rows-auto grid-auto-fit [--min-col:18rem] lg:[--min-col:20rem] xl:[--min-col:24rem] 2xl:[--min-col:28rem] gap-y-4 md:gap-y-6 xl:gap-y-8 gap-x-3 md:gap-x-4 xl:gap-x-6 transition-opacity duration-300 ease-out ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}
  >
    {groups.map((group) => (
      <PlannerCard
        key={group.key}
        surahId={group.surahId}
        plan={group.plan}
        {...(group.chapter && { chapter: group.chapter })}
        precomputedViewModel={group.viewModel}
        progressLabel={group.progressLabel}
        {...(group.continueVerse ? { continueVerse: group.continueVerse } : {})}
        onDelete={() => onDelete(group)}
      />
    ))}
  </div>
);
