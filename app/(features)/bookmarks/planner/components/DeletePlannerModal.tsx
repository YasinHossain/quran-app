'use client';

import { AnimatePresence } from 'framer-motion';
import React, { useCallback, useState } from 'react';

import {
  useEffectivePlanIds,
  usePlanCountLabel,
} from '@/app/(features)/bookmarks/planner/components/DeletePlannerModal.hooks';
import {
  DeletePlannerModalBackdrop,
  DeletePlannerModalBody,
  DeletePlannerModalHeader,
  DeletePlannerModalShell,
} from '@/app/(features)/bookmarks/planner/components/DeletePlannerModal.parts';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { logger } from '@/src/infrastructure/monitoring/Logger';

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

  const effectivePlanIds = useEffectivePlanIds({
    planIds,
    groupKey,
    planner,
    chapters,
  });
  const countLabel = usePlanCountLabel(effectivePlanIds.length);

  const { error, handleCancel, handleDelete, isDeleting } = useDeletePlannerHandlers({
    effectivePlanIds,
    onClose,
    removeFromPlanner,
  });

  const shouldRender = isOpen && effectivePlanIds.length > 0;

  return (
    <AnimatePresence>
      {shouldRender ? (
        <>
          <DeletePlannerModalBackdrop onClose={handleCancel} />

          <DeletePlannerModalShell>
            <DeletePlannerModalHeader onClose={handleCancel} />
            <DeletePlannerModalBody
              title={title}
              details={details}
              countLabel={countLabel}
              error={error}
              onCancel={handleCancel}
              onConfirm={handleDelete}
              isDeleting={isDeleting}
            />
          </DeletePlannerModalShell>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function useDeletePlannerHandlers({
  effectivePlanIds,
  onClose,
  removeFromPlanner,
}: {
  effectivePlanIds: string[];
  onClose: () => void;
  removeFromPlanner: (id: string) => void;
}): {
  error: string | null;
  handleCancel: () => void;
  handleDelete: () => Promise<void>;
  isDeleting: boolean;
} {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = useCallback((): void => {
    setError(null);
    onClose();
  }, [onClose]);

  const handleDelete = useCallback(async (): Promise<void> => {
    if (effectivePlanIds.length === 0 || isDeleting) return;

    setIsDeleting(true);
    setError(null);

    try {
      for (const id of effectivePlanIds) {
        removeFromPlanner(id);
      }
      onClose();
    } catch (err) {
      logger.error('Failed to delete planner', undefined, err as Error);
      setError('Failed to delete planner. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  }, [effectivePlanIds, isDeleting, onClose, removeFromPlanner]);

  return {
    error,
    handleCancel,
    handleDelete,
    isDeleting,
  };
}
