'use client';

import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useEffectivePlanIds,
  usePlanCountLabel,
} from '@/app/(features)/bookmarks/planner/components/DeletePlannerModal.hooks';
import {
  DeletePlannerModalBody,
  DeletePlannerModalHeader,
} from '@/app/(features)/bookmarks/planner/components/DeletePlannerModal.parts';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { UnifiedModal } from '@/app/shared/components/modal/UnifiedModal';
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
  const { t } = useTranslation();
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
    <UnifiedModal
      isOpen={shouldRender}
      onClose={handleCancel}
      ariaLabel={t('planner_delete_plan')}
      contentClassName="max-w-lg max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] overflow-hidden px-3 sm:px-4 pt-4 pb-4"
    >
      <div className="max-h-full overflow-y-auto scrollbar-hide px-1 sm:px-2">
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
      </div>
    </UnifiedModal>
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
  const { t } = useTranslation();
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
      setError(t('planner_delete_failed'));
    } finally {
      setIsDeleting(false);
    }
  }, [effectivePlanIds, isDeleting, onClose, removeFromPlanner, t]);

  return {
    error,
    handleCancel,
    handleDelete,
    isDeleting,
  };
}
