'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useMemo, useState } from 'react';

import {
  BACKDROP_VARIANTS,
  MODAL_VARIANTS,
} from '@/app/(features)/bookmarks/components/delete-folder-modal/animations';
import { ModalActions } from '@/app/(features)/bookmarks/components/delete-folder-modal/ModalActions';
import {
  buildChapterLookup,
  groupPlannerPlans,
} from '@/app/(features)/bookmarks/planner/utils/planGrouping';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { CloseIcon } from '@/app/shared/icons';
import { logger } from '@/src/infrastructure/monitoring/Logger';
import type { Chapter, PlannerPlan } from '@/types';

interface DeletePlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  planIds: string[] | null;
  groupKey: string | null;
  title: string;
  details: string | null;
}

export function DeletePlannerModal({
  isOpen,
  onClose,
  planIds,
  groupKey,
  title,
  details,
}: DeletePlannerModalProps): React.JSX.Element {
  const { removeFromPlanner, planner, chapters } = useBookmarks();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectivePlanIds = useEffectivePlanIds({
    planIds,
    groupKey,
    planner,
    chapters,
  });
  const countLabel = usePlanCountLabel(effectivePlanIds.length);

  const handleDelete = useCallback(async (): Promise<void> => {
    if (effectivePlanIds.length === 0 || isDeleting) return;
    setIsDeleting(true);
    setError(null);
    try {
      for (const id of effectivePlanIds) removeFromPlanner(id);
      onClose();
    } catch (err) {
      logger.error('Failed to delete planner', undefined, err as Error);
      setError('Failed to delete planner. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  }, [effectivePlanIds, isDeleting, onClose, removeFromPlanner]);

  const shouldRender = isOpen && effectivePlanIds.length > 0;

  return (
    <AnimatePresence>
      {shouldRender ? (
        <>
          <motion.div
            variants={BACKDROP_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-surface-overlay/60 backdrop-blur-sm z-modal"
            onClick={onClose}
          />

          <DeletePlannerModalShell>
            <DeletePlannerModalHeader onClose={onClose} />
            <div className="px-6 pb-6">
              <PlannerSummaryCard title={title} details={details} />
              <DeletePlannerWarnings countLabel={countLabel} error={error} />
              <ModalActions onClose={onClose} onDelete={handleDelete} isDeleting={isDeleting} />
            </div>
          </DeletePlannerModalShell>
        </>
      ) : null}
    </AnimatePresence>
  );
}

const DeletePlannerModalShell = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => (
  <div className="fixed inset-0 z-modal flex items-center justify-center px-4">
    <motion.div
      variants={MODAL_VARIANTS}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-modal pointer-events-auto"
    >
      {children}
    </motion.div>
  </div>
);

const DeletePlannerModalHeader = ({ onClose }: { onClose: () => void }): React.JSX.Element => (
  <div className="flex items-center justify-between p-6 pb-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-error/10 rounded-xl flex items-center justify-center">
        <svg className="w-5 h-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground">Delete Planner</h2>
        <p className="text-sm text-muted">This action cannot be undone</p>
      </div>
    </div>
    <button
      onClick={onClose}
      className="rounded-xl p-2 text-muted hover:bg-surface-hover hover:text-accent transition-all duration-200"
      aria-label="Close"
    >
      <CloseIcon size={20} />
    </button>
  </div>
);

const PlannerSummaryCard = ({
  title,
  details,
}: {
  title: string;
  details: string | null;
}): React.JSX.Element => (
  <div className="mb-4 rounded-xl border border-border bg-surface p-4">
    <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
    {details ? <p className="text-sm text-muted">{details}</p> : null}
  </div>
);

const DeletePlannerWarnings = ({
  countLabel,
  error,
}: {
  countLabel: string | null;
  error: string | null;
}): React.JSX.Element => (
  <div className="space-y-4">
    <p className="text-foreground">Are you sure you want to permanently delete this planner?</p>
    {countLabel ? (
      <div role="alert" className="bg-surface-hover border border-border rounded-xl p-4">
        <p className="text-muted text-sm">{countLabel}</p>
      </div>
    ) : null}
    {error ? (
      <p role="alert" className="text-error text-sm">
        {error}
      </p>
    ) : null}
  </div>
);

const useEffectivePlanIds = ({
  planIds,
  groupKey,
  planner,
  chapters,
}: {
  planIds: string[] | null;
  groupKey: string | null;
  planner: Record<string, PlannerPlan>;
  chapters: Chapter[];
}): string[] =>
  useMemo(() => {
    if (Array.isArray(planIds) && planIds.length > 0) return planIds;
    if (!groupKey) return [];
    const lookup = buildChapterLookup(chapters);
    const groups = groupPlannerPlans(planner, lookup);
    const match = groups.find((g) => g.key === groupKey);
    return match?.planIds ?? [];
  }, [chapters, groupKey, planIds, planner]);

const usePlanCountLabel = (count: number): string | null =>
  useMemo(() => {
    if (count <= 1) return null;
    return `This plan includes ${count} surahs. All will be removed.`;
  }, [count]);
