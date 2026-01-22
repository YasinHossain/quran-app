'use client';

import React from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { UnifiedModal } from '@/app/shared/components/modal/UnifiedModal';
import { CloseIcon } from '@/app/shared/icons';

import {
  ModalHeader,
  FormActions,
  PlannerForm,
  usePlannerCalculations,
  useFormState,
  buildPlannerPlanDefinitions,
  createPlannerPlansForRange,
} from './create-planner-modal';

import type { PlanFormData } from './create-planner-modal';
import type { Chapter, PlannerPlan } from '@/types';

interface CreatePlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePlannerModal = ({
  isOpen,
  onClose,
}: CreatePlannerModalProps): React.JSX.Element => {
  const { formData, handleFormDataChange, resetForm } = useFormState();
  const { chapters, planner, createPlannerPlan } = useBookmarks();

  const { totalVerses, versesPerDay, isValidRange } = usePlannerCalculations(
    chapters,
    formData.startSurah,
    formData.startVerse,
    formData.endSurah,
    formData.endVerse,
    formData.estimatedDays
  );

  const planDefinitions = React.useMemo(
    () => buildPlannerPlanDefinitions(formData, chapters),
    [formData, chapters]
  );
  const duplicatePlanName = useDuplicatePlanName(formData, chapters, planner, planDefinitions);

  const canSubmit =
    formData.planName.trim().length > 0 && isValidRange && totalVerses > 0 && !duplicatePlanName;

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!canSubmit) return;
    createPlannerPlansForRange(formData, chapters, createPlannerPlan);
    handleClose();
  };

  const handleClose = useCloseHandler(resetForm, onClose);

  return (
    <UnifiedModal
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel="Create planner"
      contentClassName="max-w-lg max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] overflow-hidden flex flex-col min-h-0"
    >
      <CreatePlannerForm
        formData={formData}
        onFormDataChange={handleFormDataChange}
        totalVerses={totalVerses}
        versesPerDay={versesPerDay}
        isValidRange={isValidRange}
        canSubmit={canSubmit}
        duplicatePlanName={duplicatePlanName}
        onSubmit={handleSubmit}
        chapters={chapters}
        onClose={handleClose}
      />
    </UnifiedModal>
  );
};

function useDuplicatePlanName(
  formData: PlanFormData,
  chapters: Chapter[],
  planner: Record<string, PlannerPlan>,
  planDefinitions: ReturnType<typeof buildPlannerPlanDefinitions>
): string | null {
  return React.useMemo(() => {
    if (planDefinitions.length === 0) return null;

    const trimmedInputName = formData.planName.trim();
    if (trimmedInputName.length === 0) return null;
    const normalizedInput = trimmedInputName.toLowerCase();

    const hasConflict = Object.values(planner).some((plan) => {
      const rawName = plan.notes?.trim();
      if (!rawName) return false;
      let normalizedExisting = rawName.toLowerCase();

      const chapter = chapters.find((c) => c.id === plan.surahId);
      const chapterName = chapter?.name_simple?.trim();
      if (chapterName) {
        const suffix = ` - ${chapterName}`.toLowerCase();
        if (normalizedExisting.endsWith(suffix)) {
          normalizedExisting = normalizedExisting
            .slice(0, normalizedExisting.length - suffix.length)
            .trim();
        }
      }

      return normalizedExisting === normalizedInput;
    });

    return hasConflict ? trimmedInputName : null;
  }, [planDefinitions, formData.planName, planner, chapters]);
}

function useCloseHandler(resetForm: () => void, onClose: () => void): () => void {
  return React.useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);
}

function CreatePlannerForm({
  formData,
  onFormDataChange,
  totalVerses,
  versesPerDay,
  isValidRange,
  canSubmit,
  duplicatePlanName,
  onSubmit,
  chapters,
  onClose,
}: {
  formData: PlanFormData;
  onFormDataChange: (updates: Partial<PlanFormData>) => void;
  totalVerses: number;
  versesPerDay: number;
  isValidRange: boolean;
  canSubmit: boolean;
  duplicatePlanName: string | null;
  onSubmit: (e: React.FormEvent) => void;
  chapters: Chapter[];
  onClose: () => void;
}): React.JSX.Element {
  const formId = React.useId();
  return (
    <div className="flex min-h-0 flex-col gap-4 py-6">
      <div className="flex items-start justify-between gap-4 shrink-0 px-5 sm:px-6">
        <ModalHeader />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close planner modal"
          className="shrink-0 p-1.5 rounded-full hover:bg-interactive-hover transition-colors flex items-center justify-center text-muted hover:text-foreground"
        >
          <CloseIcon size={18} />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y scrollbar-hide px-5 sm:px-6 pt-2 pb-1">
        <PlannerForm
          formData={formData}
          onFormDataChange={onFormDataChange}
          totalVerses={totalVerses}
          versesPerDay={versesPerDay}
          isValidRange={isValidRange}
          canSubmit={canSubmit}
          {...(duplicatePlanName ? { duplicatePlanName } : {})}
          onSubmit={onSubmit}
          chapters={chapters}
          formId={formId}
          showActions={false}
        />
      </div>

      <div className="shrink-0 px-5 sm:px-6">
        <FormActions canSubmit={canSubmit} formId={formId} />
      </div>
    </div>
  );
}
